// generated-by: ai-assist v1.0
// type: unit
// description: useAccountApi tests ensuring mutation wiring and pending exposure.

import { beforeEach, describe, expect, it, vi } from 'vitest'

const addAccountMock = vi.hoisted(() => vi.fn())
const useMutationMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/accounts', () => ({
  addAccount: addAccountMock,
}))

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

describe('useAccountApi', () => {
  beforeEach(() => {
    vi.resetModules()
    addAccountMock.mockReset()
    useMutationMock.mockReset()
  })

  it('registers mutation with addAccount and returns submitAccount handler', async () => {
    const mutateAsync = vi.fn()
    useMutationMock.mockReturnValue({
      mutateAsync,
      isPending: false,
    })

    const { useAccountApi } = await import('@/hooks/useAccountApi')
    const { submitAccount, isPending } = useAccountApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    expect(useMutationMock).toHaveBeenCalledWith({ mutationFn: addAccountMock })
    expect(submitAccount).toBe(mutateAsync)
    expect(isPending).toBe(false)
  })

  it('reflects pending state from useMutation result', async () => {
    useMutationMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    })

    const { useAccountApi } = await import('@/hooks/useAccountApi')
    const { isPending } = useAccountApi()

    expect(isPending).toBe(true)
  })
})
