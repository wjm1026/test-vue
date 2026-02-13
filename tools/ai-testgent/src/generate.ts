import fs from 'node:fs/promises'
import path from 'node:path'

import { LlmClient } from './llm.js'
import type { GeneratedFile, GenerationResult, TestPlan, ToolContext } from './types.js'
import { isWritableTestPath, toPosixPath, uniqBy } from './utils.js'

interface GeneratePromptResponse {
  files?: Array<Partial<GeneratedFile>>
}

export async function generateTestFiles(
  context: ToolContext,
  plan: TestPlan,
  llm: LlmClient,
  promptsDir: string,
): Promise<GenerationResult> {
  const promptPath = path.join(promptsDir, 'gen.md')
  const prompt = await fs.readFile(promptPath, 'utf8')

  const llmGeneration = await llm.requestJson<GeneratePromptResponse>(prompt, {
    context,
    plan,
  })

  if (llmGeneration?.files?.length) {
    const validated = await filterExistingTests(normalizeGeneratedFiles(llmGeneration.files))
    if (validated.length) {
      return {
        files: validated,
        source: 'llm',
      }
    }
  }

  // LLM failed or returned nothing — do NOT fallback to heuristic.
  // Heuristic tests (expect(true).toBe(true)) have no value and pollute the codebase.
  console.log('[ai-testgent] LLM returned no usable test files. Skipping generation.')
  return { files: [], source: 'heuristic' }
}

function normalizeGeneratedFiles(files: Array<Partial<GeneratedFile>>) {
  const normalized = files
    .filter((file): file is GeneratedFile => Boolean(file.path && file.content))
    .map((file) => ({
      path: toPosixPath(file.path).replace(/^\.\//, ''),
      content: file.content,
    }))
    .filter((file) => isWritableTestPath(file.path))

  return uniqBy(normalized, (file) => file.path)
}

/** Check if a test file already exists on disk — if so, skip to avoid overwriting. */
async function filterExistingTests(files: GeneratedFile[]): Promise<GeneratedFile[]> {
  const result: GeneratedFile[] = []
  for (const file of files) {
    try {
      await fs.access(path.resolve(process.cwd(), file.path))
      console.log(`[ai-testgent] Skipping ${file.path} — test file already exists.`)
    } catch {
      result.push(file)
    }
  }
  return result
}
