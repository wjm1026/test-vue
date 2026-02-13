import fs from 'node:fs/promises'
import path from 'node:path'

import { listPullRequestFiles } from './github.js'
import {
  FILE_DIFF_PATCH_LINES,
  FILE_FULL_CONTENT_LINES,
  FILE_SNIPPET_LINES,
  MAX_CHANGED_FILES,
  MAX_TEST_EXAMPLES,
  SNIPPET_HUNK_PADDING,
  TEST_EXAMPLE_CONTENT_LINES,
} from './limits.js'
import type { ChangedFileContext, TestExample, TestFramework, ToolContext } from './types.js'
import {
  isAnalysableSourceFile,
  isTestFilePath,
  parseJsonSafe,
  readTextFileIfExists,
  runCommand,
  toPosixPath,
  truncateByLines,
  uniqBy,
} from './utils.js'

interface BuildContextOptions {
  pr?: number
  baseRef?: string
  maxChangedFiles?: number
}

const DEFAULT_MAX_CHANGED_FILES = MAX_CHANGED_FILES
const DEFAULT_TEST_EXAMPLES = MAX_TEST_EXAMPLES

export async function buildContext(options: BuildContextOptions = {}): Promise<ToolContext> {
  const scripts = await readPackageScripts()
  const testFramework = detectTestFramework(scripts)
  const coverageCommand = selectCoverageCommand(scripts)
  const branch = await getCurrentBranch()

  const changedFiles = await collectChangedFiles(options)
  const testExamples = await collectTestExamples(changedFiles.map((file) => file.path), DEFAULT_TEST_EXAMPLES)

  return {
    pr: options.pr,
    repo: process.env.GITHUB_REPOSITORY,
    branch,
    testFramework,
    changedFiles,
    testExamples,
    configs: {
      scripts,
      coverageCommand,
      testDirConvention: 'src/__tests__/**/*.test.ts (mirroring src/ structure)',
    },
  }
}

async function collectChangedFiles(options: BuildContextOptions) {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPOSITORY
  const maxChangedFiles = options.maxChangedFiles ?? DEFAULT_MAX_CHANGED_FILES

  if (token && repo && typeof options.pr === 'number') {
    try {
      const prFiles = await listPullRequestFiles(token, repo, options.pr)

      // Only analyse source files under src/ (.vue, .ts, .tsx) and test files
      const analysable = prFiles.filter((file) => isAnalysableSourceFile(file.path))
      const skippedCount = prFiles.length - analysable.length
      if (skippedCount > 0) {
        console.log(`[ai-testgent] Skipped ${skippedCount} non-source file(s) (not src/**/*.{vue,ts,tsx}).`)
      }

      if (analysable.length > maxChangedFiles) {
        console.warn(`[ai-testgent] ⚠ ${analysable.length} analysable files found, only the top ${maxChangedFiles} (by diff size) will be analysed.`)
      }

      // Sort by patch size descending so the most-changed files get priority
      const sorted = [...analysable].sort((a, b) => (b.patch?.length ?? 0) - (a.patch?.length ?? 0))
      const selected = sorted.slice(0, maxChangedFiles)
      const contexts = await Promise.all(
        selected.map((file) => buildChangedFileContext(file.path, file.patch, `pr-${options.pr}`)),
      )

      return contexts
    } catch (error) {
      console.warn('[ai-testgent] Failed to read PR files via GitHub API, fallback to local git diff.')
      console.warn(String(error))
    }
  }

  const baseRef = await resolveBaseRef(options.baseRef)
  const nameDiff = await runCommand('git', ['diff', '--name-only', `${baseRef}...HEAD`])
  const allNames = nameDiff.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  // Only analyse source files under src/ (.vue, .ts, .tsx) and test files
  const analysable = allNames.filter((name) => isAnalysableSourceFile(name))
  const skippedCount = allNames.length - analysable.length
  if (skippedCount > 0) {
    console.log(`[ai-testgent] Skipped ${skippedCount} non-source file(s) (not src/**/*.{vue,ts,tsx}).`)
  }

  if (analysable.length > maxChangedFiles) {
    console.warn(`[ai-testgent] ⚠ ${analysable.length} analysable files found, only the first ${maxChangedFiles} will be analysed.`)
  }

  const names = analysable.slice(0, maxChangedFiles)

  if (!names.length) {
    return []
  }

  const contexts: ChangedFileContext[] = []

  for (const changedPath of names) {
    const patchResult = await runCommand('git', ['diff', '--unified=3', `${baseRef}...HEAD`, '--', changedPath])
    const patch = patchResult.stdout
    contexts.push(await buildChangedFileContext(changedPath, patch, `git-diff ${baseRef}...HEAD`))
  }

  return contexts
}

async function buildChangedFileContext(filePath: string, patch: string, source: string): Promise<ChangedFileContext> {
  const normalized = toPosixPath(filePath)
  const absolutePath = path.resolve(process.cwd(), normalized)
  const fullContent = await readTextFileIfExists(absolutePath)

  const patchText = patch || `/* no diff patch from ${source} */`
  const patchLineCount = patchText.split('\n').length
  if (patchLineCount > FILE_DIFF_PATCH_LINES) {
    console.warn(`[ai-testgent] ⚠ ${normalized}: diffPatch truncated from ${patchLineCount} to ${FILE_DIFF_PATCH_LINES} lines.`)
  }

  if (fullContent) {
    const fullLineCount = fullContent.split('\n').length
    if (fullLineCount > FILE_FULL_CONTENT_LINES) {
      console.warn(`[ai-testgent] ⚠ ${normalized}: fullContent truncated from ${fullLineCount} to ${FILE_FULL_CONTENT_LINES} lines.`)
    }
  }

  return {
    path: normalized,
    diffPatch: truncateByLines(patchText, FILE_DIFF_PATCH_LINES),
    snippet: buildSnippet(patch, fullContent),
    fullContent: fullContent ? truncateByLines(fullContent, FILE_FULL_CONTENT_LINES) : undefined,
  }
}

function buildSnippet(patch: string, fullContent?: string) {
  if (!fullContent) {
    return truncateByLines(patch, FILE_SNIPPET_LINES)
  }

  const ranges = extractPatchLineRanges(patch)
  if (!ranges.length) {
    return truncateByLines(fullContent, FILE_SNIPPET_LINES)
  }

  const lines = fullContent.split('\n')
  const merged = mergeRanges(
    ranges.map((range) => {
      const start = Math.max(1, range.start - SNIPPET_HUNK_PADDING)
      const end = Math.min(lines.length, range.start + range.count + SNIPPET_HUNK_PADDING)
      return { start, end }
    }),
  )

  const snippet = merged
    .map((range) => lines.slice(range.start - 1, range.end).join('\n'))
    .join('\n\n')

  return truncateByLines(snippet, FILE_SNIPPET_LINES)
}

function extractPatchLineRanges(patch: string) {
  const ranges: Array<{ start: number; count: number }> = []
  const regex = /@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/g

  for (const match of patch.matchAll(regex)) {
    const start = Number(match[1])
    const count = Number(match[2] ?? '1')
    ranges.push({ start, count })
  }

  return ranges
}

function mergeRanges(ranges: Array<{ start: number; end: number }>) {
  if (!ranges.length) {
    return []
  }

  const sorted = [...ranges].sort((a, b) => a.start - b.start)
  const merged: Array<{ start: number; end: number }> = []

  for (const range of sorted) {
    const prev = merged[merged.length - 1]
    if (!prev || range.start > prev.end + 1) {
      merged.push({ ...range })
      continue
    }

    prev.end = Math.max(prev.end, range.end)
  }

  return merged
}

async function readPackageScripts() {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json')
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8')
  const packageJson = parseJsonSafe<{ scripts?: Record<string, string> }>(packageJsonContent)

  return packageJson?.scripts ?? {}
}

function detectTestFramework(scripts: Record<string, string>): TestFramework {
  const scriptText = Object.values(scripts).join('\n')

  if (scriptText.includes('vitest')) {
    return 'vitest'
  }

  if (scriptText.includes('jest')) {
    return 'jest'
  }

  return 'unknown'
}

function selectCoverageCommand(scripts: Record<string, string>) {
  const preferred = ['test:vitest:coverage', 'test:coverage', 'test:ci', 'test:vitest', 'test']

  for (const scriptName of preferred) {
    if (scripts[scriptName]) {
      return `yarn ${scriptName}`
    }
  }

  return 'yarn test:vitest:coverage'
}

async function getCurrentBranch() {
  const result = await runCommand('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
  return result.ok ? result.stdout.trim() : 'unknown'
}

async function resolveBaseRef(input?: string) {
  const candidates = uniqBy(
    [input, 'origin/main', 'origin/master', 'main', 'master', 'HEAD~1'].filter(
      (item): item is string => Boolean(item),
    ),
    (item) => item,
  )

  for (const candidate of candidates) {
    const check = await runCommand('git', ['rev-parse', '--verify', candidate])
    if (check.ok) {
      return candidate
    }
  }

  return 'HEAD~1'
}

async function collectTestExamples(changedPaths: string[], maxExamples: number) {
  const trackedFilesResult = await runCommand('git', ['ls-files'])
  if (!trackedFilesResult.ok) {
    return []
  }

  const trackedFiles = trackedFilesResult.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const testCandidates = trackedFiles.filter((filePath) => isTestFilePath(filePath))

  if (!testCandidates.length) {
    return []
  }

  const scored = testCandidates
    .map((candidate) => ({
      path: toPosixPath(candidate),
      score: scoreTestExample(candidate, changedPaths),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  const selectedPaths = uniqBy(scored, (item) => item.path)
    .slice(0, maxExamples)
    .map((item) => item.path)

  const examples: TestExample[] = []

  for (const selectedPath of selectedPaths) {
    const content = await readTextFileIfExists(path.resolve(process.cwd(), selectedPath))
    if (!content) {
      continue
    }

    examples.push({
      path: selectedPath,
      content: truncateByLines(content, TEST_EXAMPLE_CONTENT_LINES),
    })
  }

  return examples
}

function scoreTestExample(testPathInput: string, changedPaths: string[]) {
  const testPath = toPosixPath(testPathInput)
  let bestScore = 0

  for (const changedPathInput of changedPaths) {
    const changedPath = toPosixPath(changedPathInput)

    if (isTestFilePath(changedPath)) {
      continue
    }

    const changedDir = path.posix.dirname(changedPath)
    const changedBase = path.posix.basename(changedPath, path.posix.extname(changedPath))
    const topLevel = changedPath.split('/')[0] ?? ''

    let score = 0

    if (testPath.startsWith(`${changedDir}/`)) {
      score += 60
    }

    if (testPath.includes(changedBase)) {
      score += 40
    }

    if (topLevel && testPath.startsWith(`${topLevel}/`)) {
      score += 20
    }

    bestScore = Math.max(bestScore, score)
  }

  return bestScore
}
