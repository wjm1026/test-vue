import { describe, it, expect, afterEach } from 'vitest'
import { LlmClient } from '../llm'

describe('LlmClient', () => {
  const originalEnv = process.env

  afterEach(() => {
    process.env = originalEnv
  })

  it('initializes with updated default model gemini-3-pro-high', () => {
    process.env = { ...originalEnv }
    delete process.env.LLM_MODEL
    // Ensure API key exists so enabled is true, or irrelevant for model check
    process.env.LLM_API_KEY = 'dummy'

    const client = new LlmClient(process.env)
    expect(client.model).toBe('gemini-3-pro-high')
  })

  it('respects LLM_MODEL env var override', () => {
    process.env = { ...originalEnv, LLM_MODEL: 'custom-model' }
    const client = new LlmClient(process.env)
    expect(client.model).toBe('custom-model')
  })
})
