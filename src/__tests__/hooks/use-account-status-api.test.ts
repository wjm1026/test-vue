// generated-by: ai-assist v1.0
// type: unit
// description: Ensures useAccountStatusApi wires updateStatus mutation and exposes loading ref.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const useMutationMock = vi.hoisted(() => vi.fn())
const updateStatusMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

vi.mock('@/api/accounts', () => ({
  updateStatus: updateStatusMock,
}))

describe('useAccountStatusApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useMutationMock.mockReset()
    updateStatusMock.mockReset()
  })

  it('returns updateAccountStatus and loading tied to updateStatus API', async () => {
    const mutateAsyncMock = vi.fn()
    const loadingRef = ref(false)
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: loadingRef,
    })

    const module = await import('@/hooks/useAccountStatusApi')
    const result = module.useAccountStatusApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    const options = useMutationMock.mock.calls[0]?.[0]
    expect(options?.mutationFn).toBe(updateStatusMock)

    await result.updateAccountStatus({ accountId: 1, statusCode: '00' })
    expect(mutateAsyncMock).toHaveBeenCalledWith({ accountId: 1, statusCode: '00' })
    expect(result.isStatusLoading).toBe(loadingRef)
  })

  it('mirrors pending state from useMutation', async () => {
    useMutationMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    })

    const { useAccountStatusApi } = await import('@/hooks/useAccountStatusApi')
    const { isStatusLoading } = useAccountStatusApi()

    expect(isStatusLoading).toBe(true)
  })
})
