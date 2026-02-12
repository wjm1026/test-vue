import fs from 'node:fs/promises'
import path from 'node:path'

import { LlmClient } from './llm.js'
import {
  FIX_DIFF_PATCH_LINES,
  FIX_FULL_CONTENT_LINES,
  FIX_GENERATED_FILE_CONTENT_LINES,
  FIX_MAX_CHANGED_FILES,
  FIX_MAX_GENERATED_FILES,
  FIX_MAX_TEST_CASES,
  FIX_MAX_TEST_EXAMPLES,
  FIX_SNIPPET_LINES,
  FIX_STDERR_LINES,
  FIX_STDOUT_LINES,
  FIX_TEST_EXAMPLE_CONTENT_LINES,
} from './limits.js'
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
      changedFiles: input.context.changedFiles.slice(0, FIX_MAX_CHANGED_FILES).map((file) => ({
        path: file.path,
        diffPatch: truncateByLines(file.diffPatch, FIX_DIFF_PATCH_LINES),
        snippet: truncateByLines(file.snippet, FIX_SNIPPET_LINES),
        fullContent: file.fullContent ? truncateByLines(file.fullContent, FIX_FULL_CONTENT_LINES) : undefined,
      })),
      testExamples: input.context.testExamples.slice(0, FIX_MAX_TEST_EXAMPLES).map((example) => ({
        path: example.path,
        content: truncateByLines(example.content, FIX_TEST_EXAMPLE_CONTENT_LINES),
      })),
    } as ToolContext,
    plan: {
      ...input.plan,
      testCases: input.plan.testCases.slice(0, FIX_MAX_TEST_CASES),
    } as TestPlan,
    testRun: {
      ...input.testRun,
      stdout: truncateByLines(input.testRun.stdout, FIX_STDOUT_LINES),
      stderr: truncateByLines(input.testRun.stderr, FIX_STDERR_LINES),
    } as TestRunResult,
    files: input.files.slice(0, FIX_MAX_GENERATED_FILES).map((file) => ({
      path: file.path,
      content: truncateByLines(file.content, FIX_GENERATED_FILE_CONTENT_LINES),
    })),
  }
}
