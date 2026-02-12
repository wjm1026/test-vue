import fs from 'node:fs/promises'
import path from 'node:path'

import { LlmClient } from './llm.js'
import type { FixResult, GeneratedFile, TestPlan, TestRunResult, ToolContext } from './types.js'
import { isWritableTestPath, toPosixPath, truncateByLines, uniqBy } from './utils.js'

interface FixPromptResponse {
  files?: Array<Partial<GeneratedFile>>
}

interface GenerateFixesInput {
  context: ToolContext
  plan: TestPlan
  testRun: TestRunResult
  files: GeneratedFile[]
}

export async function generateFixes(
  input: GenerateFixesInput,
  llm: LlmClient,
  promptsDir: string,
): Promise<FixResult> {
  if (!llm.enabled) {
    return {
      files: [],
      source: 'heuristic',
    }
  }

  const promptPath = path.join(promptsDir, 'fix.md')
  const prompt = await fs.readFile(promptPath, 'utf8')
  const compactInput = buildCompactFixInput(input)

  const llmResponse = await llm.requestJson<FixPromptResponse>(prompt, {
    context: compactInput.context,
    plan: compactInput.plan,
    failedRun: {
      command: compactInput.testRun.command,
      exitCode: compactInput.testRun.exitCode,
      stderr: compactInput.testRun.stderr,
      stdout: compactInput.testRun.stdout,
    },
    files: compactInput.files,
  })

  if (!llmResponse?.files?.length) {
    return {
      files: [],
      source: 'heuristic',
    }
  }

  const validated = uniqBy(
    llmResponse.files
      .filter((file): file is GeneratedFile => Boolean(file.path && file.content))
      .map((file) => ({
        path: toPosixPath(file.path).replace(/^\.\//, ''),
        content: file.content,
      }))
      .filter((file) => isWritableTestPath(file.path)),
    (file) => file.path,
  )

  return {
    files: validated,
    source: 'llm',
  }
}

function buildCompactFixInput(input: GenerateFixesInput) {
  return {
    context: {
      ...input.context,
      changedFiles: input.context.changedFiles.slice(0, 12).map((file) => ({
        path: file.path,
        diffPatch: truncateByLines(file.diffPatch, 120),
        snippet: truncateByLines(file.snippet, 120),
        fullContent: file.fullContent ? truncateByLines(file.fullContent, 180) : undefined,
      })),
      testExamples: input.context.testExamples.slice(0, 3).map((example) => ({
        path: example.path,
        content: truncateByLines(example.content, 120),
      })),
    } as ToolContext,
    plan: {
      ...input.plan,
      testCases: input.plan.testCases.slice(0, 20),
    } as TestPlan,
    testRun: {
      ...input.testRun,
      stdout: truncateByLines(input.testRun.stdout, 200),
      stderr: truncateByLines(input.testRun.stderr, 200),
    } as TestRunResult,
    files: input.files.slice(0, 10).map((file) => ({
      path: file.path,
      content: truncateByLines(file.content, 220),
    })),
  }
}
