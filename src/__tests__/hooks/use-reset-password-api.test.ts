// generated-by: ai-assist v1.0
// type: unit
// description: useResetPasswordApi tests verifying mutation setup, resetPasswordMutation exposure, and loading state.

import { beforeEach, describe, expect, it, vi } from 'vitest'

const resetPasswordMock = vi.hoisted(() => vi.fn())
const useMutationMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/login', () => ({
  resetPassword: resetPasswordMock,
}))

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

describe('useResetPasswordApi', () => {
  beforeEach(() => {
    vi.resetModules()
    resetPasswordMock.mockReset()
    useMutationMock.mockReset()
  })

  it('initializes useMutation with resetPassword API and exposes resetPasswordMutation and isPending', async () => {
    // Purpose: verify hook sets up mutation with correct API function and exposes mutateAsync and loading state.
    const mutateAsyncSpy = vi.fn()
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
      isPending: false,
    })

    const { useResetPasswordApi } = await import('@/hooks/useResetPasswordApi')
    const { resetPasswordMutation, isPending } = useResetPasswordApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    const callArgs = useMutationMock.mock.calls[0]?.[0]
    expect(callArgs).toEqual({ mutationFn: resetPasswordMock })

    expect(resetPasswordMutation).toBe(mutateAsyncSpy)
    expect(isPending).toBe(false)
  })

  it('reflects isPending state from useMutation', async () => {
    // Purpose: verify isPending mirrors the pending state from useMutation.
    useMutationMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    })

    const { useResetPasswordApi } = await import('@/hooks/useResetPasswordApi')
    const { isPending } = useResetPasswordApi()

    expect(isPending).toBe(true)
  })

  it('can be called with reset password data', async () => {
    // Purpose: verify resetPasswordMutation can be invoked with proper parameters.
    const mutateAsyncSpy = vi.fn().mockResolvedValue({ resultCode: 1 })
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
      isPending: false,
    })

    const { useResetPasswordApi } = await import('@/hooks/useResetPasswordApi')
    const { resetPasswordMutation } = useResetPasswordApi()

    const testData = {
      resetToken: 'reset-token-123',
      newPassword: 'newPassword123',
    }

    await resetPasswordMutation(testData)

    expect(mutateAsyncSpy).toHaveBeenCalledTimes(1)
    expect(mutateAsyncSpy).toHaveBeenCalledWith(testData)
  })
})
