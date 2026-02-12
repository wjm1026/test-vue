import fs from 'node:fs/promises'
import path from 'node:path'

import { LlmClient } from './llm.js'
import type { FixResult, GeneratedFile, TestPlan, TestRunResult, ToolContext } from './types.js'
import { isWritableTestPath, toPosixPath, uniqBy } from './utils.js'

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

  const llmResponse = await llm.requestJson<FixPromptResponse>(prompt, {
    context: input.context,
    plan: input.plan,
    failedRun: {
      command: input.testRun.command,
      exitCode: input.testRun.exitCode,
      stderr: input.testRun.stderr,
      stdout: input.testRun.stdout,
    },
    files: input.files,
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
