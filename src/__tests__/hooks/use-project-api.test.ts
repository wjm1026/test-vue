import { beforeEach, describe, expect, it, vi } from 'vitest'

const registrationProjectMock = vi.hoisted(() => vi.fn())
const useMutationMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/index', () => ({
  registrationProject: registrationProjectMock,
}))

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

describe('useProjectApi', () => {
  beforeEach(() => {
    vi.resetModules()
    registrationProjectMock.mockReset()
    useMutationMock.mockReset()
  })

  it('creates mutation bound to registrationProject and exposes submitProject', async () => {
    const mutateAsyncSpy = vi.fn()
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
      isPending: false,
    })

    const { useProjectApi } = await import('@/hooks/useProjectApi')
    const { submitProject, isPending } = useProjectApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    const options = useMutationMock.mock.calls[0]?.[0]
    expect(options).toEqual({ mutationFn: registrationProjectMock })

    expect(submitProject).toBe(mutateAsyncSpy)
    expect(isPending).toBe(false)
  })

  it('reflects pending status returned by useMutation', async () => {
    useMutationMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    })

    const { useProjectApi } = await import('@/hooks/useProjectApi')
    const { isPending } = useProjectApi()

    expect(isPending).toBe(true)
  })
})
