import fs from 'node:fs/promises'
import path from 'node:path'

import type { ChangedFileContext, CoverageSummary, TestRunResult, ToolContext } from './types.js'
import { isTestFilePath, parseJsonSafe, runCommandLine, toPosixPath } from './utils.js'

export async function runTests(context: ToolContext): Promise<TestRunResult> {
  const command = context.configs.coverageCommand
  const startAt = Date.now()
  const result = await runCommandLine(command, {
    cwd: process.cwd(),
  })

  const coverageSummary = await readCoverageSummary()

  return {
    ok: result.ok,
    exitCode: result.exitCode,
    stdout: result.stdout,
    stderr: result.stderr,
    command,
    durationMs: Date.now() - startAt,
    coverageSummary,
  }
}

export function createSkippedRun(command: string): TestRunResult {
  return {
    ok: true,
    exitCode: 0,
    stdout: 'Skipped by --skip-tests or --dry-run',
    stderr: '',
    command,
    durationMs: 0,
    coverageSummary: undefined,
  }
}

/**
 * Identify changed source files that have NO test coverage.
 * A file is "uncovered" if:
 *  - It doesn't appear in the coverage report at all, OR
 *  - Its statement coverage is 0%
 *
 * Only non-test source files are considered.
 */
export async function findUncoveredFiles(changedFiles: ChangedFileContext[]): Promise<ChangedFileContext[]> {
  const perFile = await readPerFileCoverage()

  const sourceFiles = changedFiles.filter((f) => !isTestFilePath(f.path))

  if (!perFile) {
    // No coverage data — treat all source files as uncovered
    console.log('[ai-testgent] No per-file coverage data found. All changed source files are candidates.')
    return sourceFiles
  }

  const uncovered: ChangedFileContext[] = []

  for (const file of sourceFiles) {
    const absPath = path.resolve(process.cwd(), file.path)
    const fileCov = perFile.get(absPath)

    if (!fileCov || fileCov.statements === 0) {
      uncovered.push(file)
      console.log(`[ai-testgent] Uncovered: ${file.path} (${fileCov ? '0%' : 'no coverage data'})`)
    } else {
      console.log(`[ai-testgent] Already covered: ${file.path} (${fileCov.statements.toFixed(1)}%)`)
    }
  }

  return uncovered
}

async function readCoverageSummary() {
  const coverageSummaryPath = path.resolve(process.cwd(), 'coverage/coverage-summary.json')

  try {
    const content = await fs.readFile(coverageSummaryPath, 'utf8')
    const parsed = parseJsonSafe<{ total?: CoverageSummary }>(content)
    return parsed?.total
  } catch {
    return undefined
  }
}

interface FileCoverage {
  statements: number
  lines: number
}

/**
 * Read per-file coverage from coverage-summary.json.
 * Returns a Map from absolute file path → coverage percentages.
 */
async function readPerFileCoverage(): Promise<Map<string, FileCoverage> | undefined> {
  const coverageSummaryPath = path.resolve(process.cwd(), 'coverage/coverage-summary.json')

  try {
    const content = await fs.readFile(coverageSummaryPath, 'utf8')
    const parsed = parseJsonSafe<Record<string, { statements?: { pct?: number }; lines?: { pct?: number } }>>(content)
    if (!parsed) return undefined

    const result = new Map<string, FileCoverage>()

    for (const [filePath, data] of Object.entries(parsed)) {
      if (filePath === 'total') continue
      result.set(
        toPosixPath(filePath),
        {
          statements: data.statements?.pct ?? 0,
          lines: data.lines?.pct ?? 0,
        },
      )
    }

    return result.size > 0 ? result : undefined
  } catch {
    return undefined
  }
}

