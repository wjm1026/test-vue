export type TestFramework = 'vitest' | 'jest' | 'unknown'

export interface ChangedFileContext {
  path: string
  diffPatch: string
  snippet: string
  fullContent?: string
}

export interface TestExample {
  path: string
  content: string
}

export interface ContextConfigs {
  scripts: Record<string, string>
  coverageCommand: string
  testDirConvention: string
}

export interface ToolContext {
  pr?: number
  repo?: string
  branch: string
  testFramework: TestFramework
  changedFiles: ChangedFileContext[]
  testExamples: TestExample[]
  configs: ContextConfigs
}

export interface TestCase {
  id: string
  title: string
  priority: 'P0' | 'P1'
  target: string
  setup: string[]
  mocks: string[]
  asserts: string[]
}

export interface TestPlan {
  testCases: TestCase[]
  source: 'llm' | 'heuristic'
  generatedAt: string
}

export interface GeneratedFile {
  path: string
  content: string
}

export interface GenerationResult {
  files: GeneratedFile[]
  source: 'llm' | 'heuristic'
}

export interface CoverageSummary {
  lines?: { pct?: number }
  statements?: { pct?: number }
  branches?: { pct?: number }
  functions?: { pct?: number }
}

export interface TestRunResult {
  ok: boolean
  exitCode: number | null
  stdout: string
  stderr: string
  command: string
  durationMs: number
  coverageSummary?: CoverageSummary
}

export interface FixResult {
  files: GeneratedFile[]
  source: 'llm' | 'heuristic'
}

export interface FinalReport {
  context: Pick<ToolContext, 'pr' | 'repo' | 'testFramework'>
  plan: TestPlan
  generation: GenerationResult
  attempts: number
  testRun: TestRunResult
  files: string[]
  createdAt: string
}
