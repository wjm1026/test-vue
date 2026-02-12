// generated-by: ai-assist v1.0
// type: unit
// description: useForgetPasswordApi tests verifying mutation setup, forgetPasswordMutation exposure, and loading state.

import { beforeEach, describe, expect, it, vi } from 'vitest'

const forgetPasswordMock = vi.hoisted(() => vi.fn())
const useMutationMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/login', () => ({
  forgetPassword: forgetPasswordMock,
}))

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

describe('useForgetPasswordApi', () => {
  beforeEach(() => {
    vi.resetModules()
    forgetPasswordMock.mockReset()
    useMutationMock.mockReset()
  })

  it('initializes useMutation with forgetPassword API and exposes forgetPasswordMutation and isPending', async () => {
    // Purpose: verify hook sets up mutation with correct API function and exposes mutateAsync and loading state.
    const mutateAsyncSpy = vi.fn()
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
      isPending: false,
    })

    const { useForgetPasswordApi } = await import('@/hooks/useForgetPasswordApi')
    const { forgetPasswordMutation, isPending } = useForgetPasswordApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    const callArgs = useMutationMock.mock.calls[0]?.[0]
    expect(callArgs).toEqual({ mutationFn: forgetPasswordMock })

    expect(forgetPasswordMutation).toBe(mutateAsyncSpy)
    expect(isPending).toBe(false)
  })

  it('reflects isPending state from useMutation', async () => {
    // Purpose: verify isPending mirrors the pending state from useMutation.
    useMutationMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    })

    const { useForgetPasswordApi } = await import('@/hooks/useForgetPasswordApi')
    const { isPending } = useForgetPasswordApi()

    expect(isPending).toBe(true)
  })

  it('can be called with forget password data', async () => {
    // Purpose: verify forgetPasswordMutation can be invoked with proper parameters.
    const mutateAsyncSpy = vi.fn().mockResolvedValue({ resultCode: 1 })
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
      isPending: false,
    })

    const { useForgetPasswordApi } = await import('@/hooks/useForgetPasswordApi')
    const { forgetPasswordMutation } = useForgetPasswordApi()

    const testData = {
      email: 'test@example.com',
    }

    await forgetPasswordMutation(testData)

    expect(mutateAsyncSpy).toHaveBeenCalledTimes(1)
    expect(mutateAsyncSpy).toHaveBeenCalledWith(testData)
  })
})
