import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateFixes } from '../fix'
import { LlmClient } from '../llm'
import * as fs from 'node:fs/promises'

// Mock dependencies
vi.mock('node:fs/promises')
vi.mock('../llm')

describe('generateFixes', () => {
  const mockLlm = {
    enabled: true,
    requestJson: vi.fn()
  }

  beforeEach(() => {
    vi.resetAllMocks()
    // @ts-ignore
    vi.mocked(LlmClient).mockImplementation(() => mockLlm)
    vi.mocked(fs.readFile).mockResolvedValue('mock prompt')
    mockLlm.requestJson.mockResolvedValue({ files: [] })
  })

  it('truncates large inputs in context and testRun', async () => {
    // Create large content exceeding truncation limits
    const largeDiff = Array(150).fill('diff line').join('\n')
    const largeStdout = Array(250).fill('stdout line').join('\n')
    const largeFileContent = Array(250).fill('code line').join('\n')

    const input = {
      context: {
        changedFiles: [
          { path: 'file1.ts', diffPatch: largeDiff, snippet: 'snip', fullContent: largeFileContent }
        ],
        testExamples: [
          { path: 'ex.ts', content: largeFileContent }
        ],
      },
      plan: {
        testCases: Array(30).fill({ id: '1' })
      },
      testRun: {
        command: 'test',
        exitCode: 1,
        stderr: 'err',
        stdout: largeStdout,
      },
      files: [
        { path: 'test.ts', content: largeFileContent }
      ],
    }

    // @ts-ignore
    await generateFixes(input, mockLlm, '/mock/prompts')

    expect(mockLlm.requestJson).toHaveBeenCalledTimes(1)
    const callArgs = mockLlm.requestJson.mock.calls[0]
    const payload = callArgs[1] as any

    // Verify truncation logic
    // diffPatch limit is 120 lines
    expect(payload.context.changedFiles[0].diffPatch.split('\n').length).toBeLessThanOrEqual(125)
    // stdout limit is 200 lines
    expect(payload.failedRun.stdout.split('\n').length).toBeLessThanOrEqual(205)
    // file content limit is 220 lines
    expect(payload.files[0].content.split('\n').length).toBeLessThanOrEqual(225)
    // testCases limit is 20
    expect(payload.plan.testCases.length).toBeLessThanOrEqual(20)
  })
})
