import { beforeEach, describe, expect, it, vi } from 'vitest'

const loginMock = vi.hoisted(() => vi.fn())
const useMutationMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/login', () => ({
  login: loginMock,
}))

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

describe('useLoginApi', () => {
  beforeEach(() => {
    vi.resetModules()
    loginMock.mockReset()
    useMutationMock.mockReset()
  })

  it('initializes useMutation with the login API and exposes mutateAsync', async () => {
    const mutateAsyncSpy = vi.fn()
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
      isPending: false,
    })

    const { useLoginApi } = await import('@/hooks/useLoginApi')
    const { loginMutation, isPending } = useLoginApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    const callArgs = useMutationMock.mock.calls[0]?.[0]
    expect(callArgs).toEqual({ mutationFn: loginMock })

    expect(loginMutation).toBe(mutateAsyncSpy)
    expect(isPending).toBe(false)
  })

  it('reflects isPending state from useMutation', async () => {
    useMutationMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    })

    const { useLoginApi } = await import('@/hooks/useLoginApi')
    const { isPending } = useLoginApi()

    expect(isPending).toBe(true)
  })
})
