import fs from 'node:fs/promises'
import path from 'node:path'

import { buildContext } from './context.js'
import { generateFixes } from './fix.js'
import { generateTestFiles } from './generate.js'
import { createPullRequestComment } from './github.js'
import { MAX_CHANGED_FILES } from './limits.js'
import { LlmClient } from './llm.js'
import { createTestPlan } from './plan.js'
import { createFinalReport, renderMarkdownReport, writeReportArtifacts } from './reporter.js'
import { createSkippedRun, runTests } from './run-tests.js'
import type { GeneratedFile, TestRunResult } from './types.js'
import { endLogGroup, isTestFilePath, logGroup, parseJsonSafe, runCommand, toPosixPath } from './utils.js'
import { writeGeneratedFiles } from './write-files.js'

interface CliOptions {
  pr?: number
  baseRef?: string
  dryRun: boolean
  skipTests: boolean
  noComment: boolean
  maxFixes: number
  maxChangedFiles: number
}

async function main() {
  const options = await parseCliOptions(process.argv.slice(2))
  const rootDir = process.cwd()
  const promptsDir = path.resolve(rootDir, 'tools/ai-testgent/prompts')

  const llm = new LlmClient()
  const context = await buildContext({
    pr: options.pr,
    baseRef: options.baseRef,
    maxChangedFiles: options.maxChangedFiles,
  })

  if (!context.changedFiles.length) {
    console.log('[ai-testgent] No changed files found. Nothing to do.')
    return
  }

  console.log(`[ai-testgent] Changed files: ${context.changedFiles.length}`)

  const uniqueWrittenPaths: string[] = []
  let currentFiles: GeneratedFile[] = []
  let attempts = 0
  let usedLlm = false
  let generationPlan: Awaited<ReturnType<typeof createTestPlan>> | undefined
  let fixPlan: Awaited<ReturnType<typeof createTestPlan>> | undefined

  // ── Step 1: Run existing tests with coverage ──────────────────────
  logGroup('Step 1: Running existing tests with coverage...')

  let testRun = options.skipTests || options.dryRun
    ? createSkippedRun(context.configs.coverageCommand)
    : await runTests(context)

  endLogGroup()

  // ── Step 2: Record failures (do not fix yet) ─────────────────────
  if (!testRun.ok && !options.skipTests && !options.dryRun) {
    const failingTestFiles = await collectFailingTestFiles(testRun, rootDir)
    if (failingTestFiles.length) {
      console.log(`[ai-testgent] Found ${failingTestFiles.length} failing test file(s).`)
      currentFiles = mergeGeneratedFiles(currentFiles, failingTestFiles)
    } else {
      console.log('[ai-testgent] Test run failed, but no failing test files were detected from output.')
    }
  } else if (testRun.ok) {
    console.log('[ai-testgent] ✅ All existing tests pass.')
  }

  // ── Step 3: Detect newly added source files (new pages/routes/features) ──
  logGroup('Step 3: Detecting new source files...')

  const newSourceFilePaths = await collectNewSourceFilePaths(context, options)
  const newSourceFiles = context.changedFiles.filter((file) => {
    if (!newSourceFilePaths.has(file.path)) return false
    if (isTestFilePath(file.path)) return false
    return isSourceFileCandidate(file.path)
  })

  if (!newSourceFiles.length) {
    console.log('[ai-testgent] No new source files detected.')
  } else {
    console.log(`[ai-testgent] New source files: ${newSourceFiles.length}`)
    for (const file of newSourceFiles.slice(0, 20)) {
      console.log(`- ${file.path}`)
    }
    if (newSourceFiles.length > 20) {
      console.log(`[ai-testgent] ...and ${newSourceFiles.length - 20} more`)
    }
  }

  endLogGroup()

  // ── Step 4: Generate tests for new source files (if any) ─────────
  if (newSourceFiles.length) {
    logGroup('Step 4: Generating tests for new source files...')

    // Build a focused context with only newly added source files
    const generationContext = { ...context, changedFiles: newSourceFiles }

    generationPlan = await createTestPlan(generationContext, llm, promptsDir)
    console.log(`[ai-testgent] Test plan: ${generationPlan.testCases.length} cases (${generationPlan.source})`)

    const generation = await generateTestFiles(generationContext, generationPlan, llm, promptsDir)

    if (generation.files.length) {
      usedLlm = usedLlm || generation.source === 'llm'
      currentFiles = mergeGeneratedFiles(currentFiles, generation.files)

      const written = await writeGeneratedFiles(generation.files, {
        rootDir,
        dryRun: options.dryRun,
      })

      for (const p of written) {
        if (!uniqueWrittenPaths.includes(p)) uniqueWrittenPaths.push(p)
      }

      if (options.dryRun) {
        console.log(`[ai-testgent] Dry run: ${written.length} file(s) validated but not written.`)
      } else {
        console.log(`[ai-testgent] Wrote ${written.length} new test file(s).`)
      }
    } else {
      console.log('[ai-testgent] No new test files generated.')
    }

    endLogGroup()

    // ── Step 5: Run tests again to validate new tests ─────────────
    if (!options.skipTests && !options.dryRun && uniqueWrittenPaths.length) {
      logGroup('Step 5: Running tests again to validate...')
      testRun = await runTests(context)
      endLogGroup()
    }
  }

  // ── Step 6: Fix failing tests (global attempts, max = --max-fixes) ─
  if (!testRun.ok && !options.skipTests && !options.dryRun) {
    logGroup('Step 6: Tests failed. Attempting to fix failing tests...')

    // Plan is only required for the LLM fix prompt; create it once for this fix loop.
    fixPlan = await createTestPlan(context, llm, promptsDir)

    while (!testRun.ok && attempts < options.maxFixes) {
      attempts += 1
      console.log(`[ai-testgent] Fix attempt ${attempts}/${options.maxFixes}`)

      // Refresh failing test files from disk so the fix prompt can see the latest state.
      const failingTestFiles = await collectFailingTestFiles(testRun, rootDir)
      if (failingTestFiles.length) {
        currentFiles = mergeGeneratedFiles(currentFiles, failingTestFiles)
      }

      const fixResult = await generateFixes(
        {
          context,
          plan: fixPlan,
          testRun,
          files: currentFiles,
        },
        llm,
        promptsDir,
      )

      if (!fixResult.files.length) {
        console.log('[ai-testgent] No fix patch generated. Stopping fix loop.')
        break
      }

      usedLlm = usedLlm || fixResult.source === 'llm'
      currentFiles = mergeGeneratedFiles(currentFiles, fixResult.files)

      const fixedPaths = await writeGeneratedFiles(fixResult.files, {
        rootDir,
        dryRun: options.dryRun,
      })

      for (const p of fixedPaths) {
        if (!uniqueWrittenPaths.includes(p)) uniqueWrittenPaths.push(p)
      }

      testRun = await runTests(context)
    }

    if (testRun.ok) {
      console.log('[ai-testgent] ✅ Tests fixed successfully.')
    } else {
      console.log('[ai-testgent] ⚠ Could not fix all test failures.')
    }

    endLogGroup()
  }

  // ── Report ────────────────────────────────────────────────────────
  const finalPlan = generationPlan ?? fixPlan ?? {
    testCases: [],
    source: 'heuristic' as const,
    generatedAt: new Date().toISOString(),
  }
  const finalReport = createFinalReport(
    context,
    finalPlan,
    { source: usedLlm ? 'llm' : 'heuristic', files: currentFiles },
    testRun,
    uniqueWrittenPaths,
    attempts,
  )

  const markdown = renderMarkdownReport(finalReport)
  const artifacts = await writeReportArtifacts(rootDir, finalReport, markdown)

  console.log(`\n[ai-testgent] Report JSON: ${artifacts.jsonPath}`)
  console.log(`[ai-testgent] Report Markdown: ${artifacts.markdownPath}`)

  if (context.pr && context.repo && process.env.GITHUB_TOKEN && !options.noComment) {
    try {
      await createPullRequestComment(process.env.GITHUB_TOKEN, context.repo, context.pr, markdown)
      console.log('[ai-testgent] Posted report comment to pull request.')
    } catch (error) {
      console.warn('[ai-testgent] Failed to post PR comment:')
      console.warn(String(error))
    }
  }

  if (!testRun.ok) {
    process.exitCode = 1
  }
}

function mergeGeneratedFiles(base: GeneratedFile[], updates: GeneratedFile[]) {
  const map = new Map<string, GeneratedFile>()

  for (const file of base) {
    map.set(file.path, file)
  }

  for (const file of updates) {
    map.set(file.path, file)
  }

  return Array.from(map.values())
}

function isSourceFileCandidate(filePath: string) {
  const normalized = toPosixPath(filePath).replace(/^\.\//, '')

  if (!normalized.startsWith('src/')) {
    return false
  }

  if (normalized.startsWith('src/e2e/')) {
    return false
  }

  if (isTestFilePath(normalized)) {
    return false
  }

  return /\.(vue|ts|tsx)$/.test(normalized)
}

function isNewFileDiffPatch(diffPatch: string) {
  if (!diffPatch) {
    return false
  }

  // Local git diff includes headers like "new file mode" or "--- /dev/null".
  if (diffPatch.includes('new file mode') || diffPatch.includes('--- /dev/null')) {
    return true
  }

  // GitHub PR patch payloads often start at hunks only; new files include "-0,0".
  return /@@\s+-0,0\s+\+\d+/.test(diffPatch)
}

async function collectNewSourceFilePaths(context: Awaited<ReturnType<typeof buildContext>>, options: CliOptions) {
  const paths = new Set<string>()

  // 1) Detect via patch content (works for most diffs)
  for (const file of context.changedFiles) {
    if (isNewFileDiffPatch(file.diffPatch)) {
      paths.add(file.path)
    }
  }

  // 2) Fallback to git status diff (handles large diffs where PR API omits patch)
  const baseRef = await resolveBaseRefForStatusDiff(options)
  if (!baseRef) {
    return paths
  }

  const diff = await runCommand('git', ['diff', '--name-status', `${baseRef}...HEAD`])
  if (!diff.ok) {
    return paths
  }

  for (const rawLine of diff.stdout.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue

    const parts = line.split('\t').filter(Boolean)
    const status = parts[0] ?? ''
    const filePath = parts[1] ?? ''

    if (status === 'A' && filePath) {
      paths.add(toPosixPath(filePath))
    }
  }

  return paths
}

async function resolveBaseRefForStatusDiff(options: CliOptions) {
  const baseSha = typeof options.pr === 'number' ? await inferPrBaseShaFromEvent() : undefined
  const envBaseRef = process.env.GITHUB_BASE_REF

  const candidates = [
    options.baseRef,
    baseSha,
    envBaseRef ? `origin/${envBaseRef}` : undefined,
    envBaseRef,
    'origin/main',
    'origin/master',
    'main',
    'master',
    'HEAD~1',
  ].filter((item): item is string => Boolean(item))

  const seen = new Set<string>()
  for (const candidate of candidates) {
    if (seen.has(candidate)) continue
    seen.add(candidate)

    const check = await runCommand('git', ['rev-parse', '--verify', candidate])
    if (check.ok) {
      return candidate
    }
  }

  return undefined
}

async function inferPrBaseShaFromEvent() {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) {
    return undefined
  }

  const eventContent = await fs.readFile(eventPath, 'utf8').catch(() => undefined)
  if (!eventContent) {
    return undefined
  }

  const eventJson = parseJsonSafe<{ pull_request?: { base?: { sha?: string } } }>(eventContent)
  const baseSha = eventJson?.pull_request?.base?.sha

  if (typeof baseSha !== 'string' || !baseSha.trim()) {
    return undefined
  }

  return baseSha.trim()
}

/**
 * Parse test runner output to find failing test file paths,
 * then read their content from disk so the fix prompt can see them.
 *
 * Supports vitest / jest output formats:
 *   FAIL  src/__tests__/util/date-format.test.ts
 *   ❯ src/__tests__/foo.test.ts:12:5
 */
async function collectFailingTestFiles(testRun: TestRunResult, rootDir: string): Promise<GeneratedFile[]> {
  const output = [testRun.stdout, testRun.stderr].join('\n')
  const testFilePathPattern = /(src\/__tests__\/\S+\.(?:test|spec)\.(?:ts|tsx|js|jsx|mjs|cjs))(?:\:\d+\:\d+)?/g
  const paths = new Set<string>()

  let match: RegExpExecArray | null = null
  while ((match = testFilePathPattern.exec(output)) !== null) {
    const filePath = match[1]
    if (filePath) paths.add(filePath)
  }

  const files: GeneratedFile[] = []

  for (const relPath of paths) {
    try {
      const absPath = path.resolve(rootDir, relPath)
      const content = await fs.readFile(absPath, 'utf8')
      files.push({ path: relPath, content })
    } catch {
      // File not found — skip
    }
  }

  return files
}

async function parseCliOptions(args: string[]): Promise<CliOptions> {
  const options: CliOptions = {
    pr: undefined,
    baseRef: undefined,
    dryRun: false,
    skipTests: false,
    noComment: false,
    maxFixes: 3,
    maxChangedFiles: MAX_CHANGED_FILES,
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }

    if (arg === '--pr') {
      const value = args[index + 1]
      if (!value) {
        throw new Error('--pr requires a numeric value')
      }
      options.pr = Number(value)
      index += 1
      continue
    }

    if (arg === '--base') {
      const value = args[index + 1]
      if (!value) {
        throw new Error('--base requires a git ref value')
      }
      options.baseRef = value
      index += 1
      continue
    }

    if (arg === '--max-fixes') {
      const value = Number(args[index + 1])
      if (!Number.isInteger(value) || value < 0) {
        throw new Error('--max-fixes requires a non-negative integer')
      }
      options.maxFixes = value
      index += 1
      continue
    }

    if (arg === '--max-files') {
      const value = Number(args[index + 1])
      if (!Number.isInteger(value) || value <= 0) {
        throw new Error('--max-files requires a positive integer')
      }
      options.maxChangedFiles = value
      index += 1
      continue
    }

    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }

    if (arg === '--skip-tests') {
      options.skipTests = true
      continue
    }

    if (arg === '--no-comment') {
      options.noComment = true
      continue
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (typeof options.pr !== 'number' || Number.isNaN(options.pr)) {
    options.pr = await inferPrNumberFromEvent()
  }

  return options
}

async function inferPrNumberFromEvent() {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) {
    return undefined
  }

  const eventContent = await fs.readFile(eventPath, 'utf8').catch(() => undefined)
  if (!eventContent) {
    return undefined
  }

  const eventJson = parseJsonSafe<{ pull_request?: { number?: number } }>(eventContent)
  const prNumber = eventJson?.pull_request?.number

  if (typeof prNumber !== 'number') {
    return undefined
  }

  return prNumber
}

function printHelp() {
  console.log(`
Usage: yarn ai-testgent --pr <number> [options]

Options:
  --pr <number>       Pull request number (optional in GitHub Actions)
  --base <ref>        Base git ref for local diff (default: auto detect)
  --max-fixes <n>     Max auto-fix attempts after failed test run (default: 3)
  --max-files <n>     Max changed files to inspect (default: ${MAX_CHANGED_FILES})
  --dry-run           Validate generation only, do not write files
  --skip-tests        Skip running test command
  --no-comment        Do not write back PR comment
  --help, -h          Show this help message
  `)
}

main().catch((error) => {
  console.error('[ai-testgent] Fatal error')
  console.error(error)
  process.exit(1)
})
