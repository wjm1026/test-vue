import fs from 'node:fs/promises'
import path from 'node:path'

import { LlmClient } from './llm.js'
import type { TestCase, TestPlan, ToolContext } from './types.js'
import { isTestFilePath } from './utils.js'

interface PlanPromptResponse {
  testCases?: Array<Partial<TestCase>>
}

export async function createTestPlan(context: ToolContext, llm: LlmClient, promptsDir: string): Promise<TestPlan> {
  const planPromptPath = path.join(promptsDir, 'plan.md')
  const prompt = await fs.readFile(planPromptPath, 'utf8')

  const llmPlan = await llm.requestJson<PlanPromptResponse>(prompt, {
    context,
  })

  if (llmPlan?.testCases?.length) {
    return {
      testCases: normalizeCases(llmPlan.testCases),
      source: 'llm',
      generatedAt: new Date().toISOString(),
    }
  }

  return {
    testCases: createHeuristicCases(context),
    source: 'heuristic',
    generatedAt: new Date().toISOString(),
  }
}

function normalizeCases(cases: Array<Partial<TestCase>>): TestCase[] {
  return cases.slice(0, 50).map((item, index) => {
    const priority: TestCase['priority'] = item.priority === 'P1' ? 'P1' : 'P0'

    return {
      id: item.id || `TC-${String(index + 1).padStart(3, '0')}`,
      title: item.title || `Generated case ${index + 1}`,
      priority,
      target: item.target || 'unknown::module',
      setup: item.setup ?? [],
      mocks: item.mocks ?? [],
      asserts: item.asserts ?? [],
    }
  })
}

function createHeuristicCases(context: ToolContext) {
  const cases: TestCase[] = []

  const candidates = context.changedFiles.filter((file) => !isTestFilePath(file.path)).slice(0, 12)

  for (const [index, changedFile] of candidates.entries()) {
    const exportedTarget = extractFirstExportedSymbol(changedFile.fullContent)
    const target = `${changedFile.path}::${exportedTarget}`

    cases.push({
      id: `TC-${String(index + 1).padStart(3, '0')}`,
      title: `${path.posix.basename(changedFile.path)} behavior should stay stable`,
      priority: index < 4 ? 'P0' : 'P1',
      target,
      setup: ['Create the smallest valid input for this module.'],
      mocks: ['Mock external side effects and network dependencies if any.'],
      asserts: ['Assert deterministic output for the changed logic path.'],
    })
  }

  if (!cases.length) {
    cases.push({
      id: 'TC-001',
      title: 'No changed source file detected, keep smoke test stable',
      priority: 'P0',
      target: 'tests::smoke',
      setup: ['Use a deterministic assertion.'],
      mocks: [],
      asserts: ['Ensure test runner is healthy.'],
    })
  }

  return cases
}

function extractFirstExportedSymbol(content?: string) {
  if (!content) {
    return 'module'
  }

  const functionMatch = content.match(/export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)/)
  if (functionMatch?.[1]) {
    return functionMatch[1]
  }

  const constMatch = content.match(/export\s+const\s+([A-Za-z0-9_]+)/)
  if (constMatch?.[1]) {
    return constMatch[1]
  }

  const classMatch = content.match(/export\s+class\s+([A-Za-z0-9_]+)/)
  if (classMatch?.[1]) {
    return classMatch[1]
  }

  return 'module'
}
