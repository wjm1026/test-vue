import fs from 'node:fs/promises'
import path from 'node:path'

import type { CoverageSummary, TestRunResult, ToolContext } from './types.js'
import { parseJsonSafe, runCommandLine } from './utils.js'

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
