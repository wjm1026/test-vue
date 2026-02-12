import fs from 'node:fs/promises'
import path from 'node:path'

import { LlmClient } from './llm.js'
import type { GeneratedFile, GenerationResult, TestPlan, ToolContext } from './types.js'
import { isTestFilePath, isWritableTestPath, toPosixPath, uniqBy } from './utils.js'

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

  const heuristicFiles = await filterExistingTests(createHeuristicFiles(context, plan))
  return {
    files: heuristicFiles,
    source: 'heuristic',
  }
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

function createHeuristicFiles(context: ToolContext, plan: TestPlan) {
  const grouped = new Map<string, string[]>()

  for (const [index, testCase] of plan.testCases.entries()) {
    const sourcePath = testCase.target.split('::')[0] || ''
    const filePath = deriveTestFilePath(sourcePath, index)
    const caseBody = [
      `  it('${escapeSingleQuotes(testCase.title)}', () => {`,
      '    expect(true).toBe(true)',
      '  })',
    ].join('\n')

    const existing = grouped.get(filePath) ?? []
    existing.push(caseBody)
    grouped.set(filePath, existing)
  }

  const importLine =
    context.testFramework === 'vitest' || context.testFramework === 'unknown'
      ? "import { describe, it, expect } from 'vitest'\n\n"
      : ''

  const generated: GeneratedFile[] = []

  for (const [filePath, testCaseBlocks] of grouped) {
    const suiteName = path.posix.basename(filePath)
    const content = [
      importLine,
      `describe('${escapeSingleQuotes(suiteName)} (ai-testgent)', () => {`,
      ...testCaseBlocks,
      '})',
      '',
    ].join('\n')

    generated.push({
      path: filePath,
      content,
    })
  }

  return generated
}

function deriveTestFilePath(sourcePathInput: string, index: number) {
  const sourcePath = toPosixPath(sourcePathInput).replace(/^\.\//, '')

  if (sourcePath && sourcePath.startsWith('src/')) {
    // src/util/date-format.ts → src/__tests__/util/date-format.test.ts
    const withoutSrc = sourcePath.slice('src/'.length)
    const dir = path.posix.dirname(withoutSrc)
    const ext = path.posix.extname(withoutSrc)
    const baseName = path.posix.basename(withoutSrc, ext)
    const subDir = dir && dir !== '.' ? `${dir}/` : ''
    return `src/__tests__/${subDir}${baseName}.test.ts`
  }

  if (sourcePath && sourcePath.startsWith('src/__tests__/')) {
    return sourcePath
  }

  return `src/__tests__/generated-${String(index + 1).padStart(2, '0')}.test.ts`
}

function escapeSingleQuotes(value: string) {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")
}
