import { beforeEach, describe, expect, it, vi } from 'vitest'

const deleteProjectMock = vi.hoisted(() => vi.fn())
const useMutationMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/index', () => ({
  deleteProject: deleteProjectMock,
}))

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

describe('useProjectDeleteApi', () => {
  beforeEach(() => {
    vi.resetModules()
    deleteProjectMock.mockReset()
    useMutationMock.mockReset()
  })

  it('provides deleteProjectMutateAsync and loading state from useMutation', async () => {
    const mutateAsyncSpy = vi.fn()
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
      isPending: false,
    })

    const { useProjectDeleteApi } = await import('@/hooks/useProjectDeleteApi')
    const { deleteProjectMutateAsync, isDeleteLoading } = useProjectDeleteApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    const options = useMutationMock.mock.calls[0]?.[0]
    expect(options).toEqual({ mutationFn: deleteProjectMock })

    expect(deleteProjectMutateAsync).toBe(mutateAsyncSpy)
    expect(isDeleteLoading).toBe(false)
  })

  it('mirrors pending state from useMutation', async () => {
    useMutationMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    })

    const { useProjectDeleteApi } = await import('@/hooks/useProjectDeleteApi')
    const { isDeleteLoading } = useProjectDeleteApi()

    expect(isDeleteLoading).toBe(true)
  })
})
