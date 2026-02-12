// generated-by: ai-assist v1.0
// type: unit
// description: Ensures useAccountDeleteApi wires deleteAccount mutation and exposes loading ref.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const useMutationMock = vi.hoisted(() => vi.fn())
const deleteAccountMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

vi.mock('@/api/accounts', () => ({
  deleteAccount: deleteAccountMock,
}))

describe('useAccountDeleteApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useMutationMock.mockReset()
    deleteAccountMock.mockReset()
  })

  it('returns mutation helpers tied to deleteAccount API', async () => {
    const mutateAsyncMock = vi.fn()
    const loadingRef = ref(false)
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: loadingRef,
    })

    const module = await import('@/hooks/useAccountDeleteApi')
    const result = module.useAccountDeleteApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    const options = useMutationMock.mock.calls[0]?.[0]
    expect(options?.mutationFn).toBe(deleteAccountMock)

    await result.deleteAccountMutateAsync(1)
    expect(mutateAsyncMock).toHaveBeenCalledWith(1)
    expect(result.isDeleteLoading).toBe(loadingRef)
  })
})
