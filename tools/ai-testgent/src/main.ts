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
import { createSkippedRun, findUncoveredFiles, runTests } from './run-tests.js'
import type { GeneratedFile, TestRunResult } from './types.js'
import { parseJsonSafe } from './utils.js'
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

  // ── Step 1: Run existing tests with coverage ──────────────────────
  console.log('\n[ai-testgent] ▶ Step 1: Running existing tests with coverage...')

  let testRun = options.skipTests || options.dryRun
    ? createSkippedRun(context.configs.coverageCommand)
    : await runTests(context)

  let attempts = 0
  const uniqueWrittenPaths: string[] = []
  let currentFiles: GeneratedFile[] = []

  // ── Step 2: If tests fail, try to fix ─────────────────────────────
  if (!testRun.ok && !options.skipTests && !options.dryRun) {
    console.log('\n[ai-testgent] ▶ Step 2: Existing tests failed. Attempting to fix...')

    // Collect existing failing test files from disk so the fix prompt can see them
    const failingTestFiles = await collectFailingTestFiles(testRun, rootDir)
    if (failingTestFiles.length) {
      console.log(`[ai-testgent] Found ${failingTestFiles.length} failing test file(s) to fix.`)
      currentFiles = failingTestFiles
    }

    const fixPlan = await createTestPlan(context, llm, promptsDir)

    while (!testRun.ok && attempts < options.maxFixes) {
      attempts += 1
      console.log(`[ai-testgent] Fix attempt ${attempts}/${options.maxFixes}`)

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
      console.log('[ai-testgent] ✅ Existing tests fixed successfully.')
    } else {
      console.log('[ai-testgent] ⚠ Could not fix all test failures.')
    }
  } else if (testRun.ok) {
    console.log('[ai-testgent] ✅ All existing tests pass.')
  }

  // ── Step 3: Find uncovered changed files ──────────────────────────
  console.log('\n[ai-testgent] ▶ Step 3: Checking coverage for changed files...')

  const uncoveredFiles = options.skipTests || options.dryRun
    ? context.changedFiles
    : await findUncoveredFiles(context.changedFiles)

  if (!uncoveredFiles.length) {
    console.log('[ai-testgent] All changed files are already covered. No new tests needed. 🎉')
  } else {
    console.log(`[ai-testgent] ${uncoveredFiles.length} file(s) need test coverage.`)

    // ── Step 4: Generate tests only for uncovered files ────────────
    console.log('\n[ai-testgent] ▶ Step 4: Generating tests for uncovered files...')

    // Build a focused context with only uncovered files
    const uncoveredContext = { ...context, changedFiles: uncoveredFiles }

    const plan = await createTestPlan(uncoveredContext, llm, promptsDir)
    console.log(`[ai-testgent] Test plan: ${plan.testCases.length} cases (${plan.source})`)

    const generation = await generateTestFiles(uncoveredContext, plan, llm, promptsDir)

    if (generation.files.length) {
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

      // ── Step 5: Run tests again to validate ───────────────────
      if (!options.skipTests && !options.dryRun) {
        console.log('\n[ai-testgent] ▶ Step 5: Running tests again to validate new tests...')
        testRun = await runTests(context)

        // Try to fix newly generated tests if they fail
        let genFixAttempts = 0
        while (!testRun.ok && genFixAttempts < options.maxFixes) {
          genFixAttempts += 1
          attempts += 1
          console.log(`[ai-testgent] New test fix attempt ${genFixAttempts}/${options.maxFixes}`)

          const fixPlan = await createTestPlan(uncoveredContext, llm, promptsDir)
          const fixResult = await generateFixes(
            { context: uncoveredContext, plan: fixPlan, testRun, files: currentFiles },
            llm,
            promptsDir,
          )

          if (!fixResult.files.length) break

          currentFiles = mergeGeneratedFiles(currentFiles, fixResult.files)
          const fixedPaths = await writeGeneratedFiles(fixResult.files, { rootDir, dryRun: options.dryRun })
          for (const p of fixedPaths) {
            if (!uniqueWrittenPaths.includes(p)) uniqueWrittenPaths.push(p)
          }

          testRun = await runTests(context)
        }
      }
    } else {
      console.log('[ai-testgent] No new test files generated.')
    }
  }

  // ── Report ────────────────────────────────────────────────────────
  const plan = await createTestPlan(context, llm, promptsDir)
  const finalReport = createFinalReport(
    context,
    plan,
    { source: currentFiles.length ? 'llm' : 'heuristic', files: currentFiles },
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
  const testFilePathPattern = /(?:FAIL|❯|×)\s+(src\/__tests__\/\S+\.test\.ts)/g
  const paths = new Set<string>()

  let match: RegExpExecArray | null = null
  while ((match = testFilePathPattern.exec(output)) !== null) {
    // Strip trailing :line:col if present
    const filePath = match[1].replace(/:\d+:\d+$/, '')
    paths.add(filePath)
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
    maxFixes: 2,
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
  --max-fixes <n>     Max auto-fix attempts after failed test run (default: 2)
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
