import { afterEach, describe, expect, it, vi } from 'vitest'

describe('useApiStub', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('reflects the value from VITE_USE_API_STUB', async () => {
    vi.stubEnv('VITE_USE_API_STUB', 'false')
    const { useApiStub } = await import('@/setting/api-mode')
    expect(useApiStub).toBe('false')
  })

  it('updates when environment changes before import', async () => {
    vi.stubEnv('VITE_USE_API_STUB', 'true')
    const { useApiStub } = await import('@/setting/api-mode')
    expect(useApiStub).toBe('true')
  })
})
