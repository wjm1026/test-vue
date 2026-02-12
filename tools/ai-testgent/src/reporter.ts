import fs from 'node:fs/promises'
import path from 'node:path'

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
    .slice(0, 20)
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
    '### Test Output (tail)',
    '```text',
    tailOutput([report.testRun.stdout, report.testRun.stderr].filter(Boolean).join('\n'), 120),
    '```',
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

function tailOutput(text: string, maxLines: number) {
  const lines = text.split('\n')
  if (lines.length <= maxLines) {
    return text
  }

  return lines.slice(lines.length - maxLines).join('\n')
}
