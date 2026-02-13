import fs from 'node:fs/promises'
import path from 'node:path'

import { REPORT_MAX_TEST_CASES, REPORT_TAIL_OUTPUT_LINES } from './limits.js'
import type { FinalReport, GenerationResult, TestPlan, TestRunResult, ToolContext } from './types.js'

export function createFinalReport(
  context: ToolContext,
  plan: TestPlan,
  generation: GenerationResult,
  testRun: TestRunResult,
  files: string[],
  attempts: number,
): FinalReport {
  return {
    context: {
      pr: context.pr,
      repo: context.repo,
      testFramework: context.testFramework,
    },
    plan,
    generation,
    attempts,
    testRun,
    files,
    createdAt: new Date().toISOString(),
  }
}

export function renderMarkdownReport(report: FinalReport) {
  const coverage = report.testRun.coverageSummary
  const coverageLine = coverage
    ? `- Coverage: lines ${formatPct(coverage.lines?.pct)}, statements ${formatPct(coverage.statements?.pct)}, functions ${formatPct(coverage.functions?.pct)}, branches ${formatPct(coverage.branches?.pct)}`
    : '- Coverage: unavailable'

  const caseLines = report.plan.testCases
    .slice(0, REPORT_MAX_TEST_CASES)
    .map((testCase) => `- [${testCase.priority}] ${testCase.id} ${testCase.title} -> ${testCase.target}`)
    .join('\n')

  const generatedFiles = report.files.length ? report.files.map((file) => `- ${file}`).join('\n') : '- none'

  return [
    '<!-- ai-testgent-report -->',
    '## AI TestGent Report',
    '',
    `- PR: ${report.context.pr ?? 'N/A'}`,
    `- Repo: ${report.context.repo ?? 'local'}`,
    `- Test Framework: ${report.context.testFramework}`,
    `- Plan Source: ${report.plan.source}`,
    `- Generation Source: ${report.generation.source}`,
    `- Fix Attempts: ${report.attempts}`,
    `- Test Command: ${report.testRun.command}`,
    `- Result: ${report.testRun.ok ? 'PASS' : 'FAIL'} (exit ${report.testRun.exitCode ?? 'N/A'})`,
    coverageLine,
    '',
    '### Test Plan',
    caseLines || '- none',
    '',
    '### Generated Files',
    generatedFiles,
    '',
    '### Test Output',
    '<details>',
    `<summary>Click to expand (last ${REPORT_TAIL_OUTPUT_LINES} lines, coverage table stripped)</summary>`,
    '',
    '```text',
    tailOutput(
      stripCoverageTable([report.testRun.stdout, report.testRun.stderr].filter(Boolean).join('\n')),
      REPORT_TAIL_OUTPUT_LINES,
    ),
    '```',
    '',
    '</details>',
    '',
  ].join('\n')
}

export async function writeReportArtifacts(rootDir: string, report: FinalReport, markdown: string) {
  const outputDir = path.resolve(rootDir, 'output')
  await fs.mkdir(outputDir, { recursive: true })

  const jsonPath = path.join(outputDir, 'ai-testgent-report.json')
  const markdownPath = path.join(outputDir, 'ai-testgent-report.md')

  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), 'utf8')
  await fs.writeFile(markdownPath, markdown, 'utf8')

  return {
    jsonPath,
    markdownPath,
  }
}

function formatPct(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'N/A'
  }

  return `${value.toFixed(2)}%`
}

/**
 * Strip the per-file coverage table from vitest / jest output.
 * The coverage *summary* is already shown separately in the report header,
 * so the noisy per-file table just wastes space in the PR comment.
 *
 * Matches lines like:
 *   src/foo.ts  | 100 | 80 | 100 | 90 |
 *   ------------|-----|----|-...-|....|
 *   File        | ... |
 *   All files   | ... |
 */
function stripCoverageTable(text: string) {
  return text
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim()

      // Table separator lines: ---|---|---
      if (/^[-|:\s]+$/.test(trimmed) && trimmed.includes('|') && trimmed.includes('-')) {
        return false
      }

      // Coverage data rows: <name> | <number> | <number> | ...
      // At least 3 pipe-separated numeric-ish columns
      if (trimmed.includes('|')) {
        const cells = trimmed.split('|').map((c) => c.trim())
        const numericCells = cells.filter((c) => /^\d+(\.\d+)?$/.test(c))
        if (numericCells.length >= 3) {
          return false
        }
      }

      // Header rows like "File  | % Stmts | ..."
      if (/^\s*(File|All files)\s*\|/.test(trimmed)) {
        return false
      }

      return true
    })
    .join('\n')
}

function tailOutput(text: string, maxLines: number) {
  const lines = text.split('\n')
  if (lines.length <= maxLines) {
    return text
  }

  return lines.slice(lines.length - maxLines).join('\n')
}
