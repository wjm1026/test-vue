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
import type { GeneratedFile } from './types.js'
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
    console.log('[ai-testgent] No changed files found. Nothing to generate.')
    return
  }

  console.log(`[ai-testgent] Changed files: ${context.changedFiles.length}`)

  const plan = await createTestPlan(context, llm, promptsDir)
  console.log(`[ai-testgent] Generated plan with ${plan.testCases.length} cases (${plan.source})`)

  const generation = await generateTestFiles(context, plan, llm, promptsDir)
  let currentFiles = generation.files

  if (!currentFiles.length) {
    console.log('[ai-testgent] No test files generated. Exiting.')
    return
  }

  const written = await writeGeneratedFiles(currentFiles, {
    rootDir,
    dryRun: options.dryRun,
  })

  const uniqueWrittenPaths = [...written]

  if (options.dryRun) {
    console.log('[ai-testgent] Dry run enabled. Files were validated but not written.')
  } else {
    console.log(`[ai-testgent] Wrote ${written.length} file(s)`)
  }

  let attempts = 0
  let testRun = options.skipTests || options.dryRun ? createSkippedRun(context.configs.coverageCommand) : await runTests(context)

  while (!testRun.ok && attempts < options.maxFixes) {
    attempts += 1
    console.log(`[ai-testgent] Test run failed. Attempting fix ${attempts}/${options.maxFixes}`)

    const fixResult = await generateFixes(
      {
        context,
        plan,
        testRun,
        files: currentFiles,
      },
      llm,
      promptsDir,
    )

    if (!fixResult.files.length) {
      console.log('[ai-testgent] No fix patch generated. Stop retry loop.')
      break
    }

    currentFiles = mergeGeneratedFiles(currentFiles, fixResult.files)
    const fixedPaths = await writeGeneratedFiles(fixResult.files, {
      rootDir,
      dryRun: options.dryRun,
    })

    for (const fixedPath of fixedPaths) {
      if (!uniqueWrittenPaths.includes(fixedPath)) {
        uniqueWrittenPaths.push(fixedPath)
      }
    }

    if (options.skipTests || options.dryRun) {
      break
    }

    testRun = await runTests(context)
  }

  const finalReport = createFinalReport(
    context,
    plan,
    {
      source: generation.source,
      files: currentFiles,
    },
    testRun,
    uniqueWrittenPaths,
    attempts,
  )

  const markdown = renderMarkdownReport(finalReport)
  const artifacts = await writeReportArtifacts(rootDir, finalReport, markdown)

  console.log(`[ai-testgent] Report JSON: ${artifacts.jsonPath}`)
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
