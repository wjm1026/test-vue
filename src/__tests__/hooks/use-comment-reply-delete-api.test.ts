// generated-by: ai-assist v1.0
// type: unit
// description: useCommentReplyDeleteApi tests verifying mutation setup, deleteReply exposure, and loading state.

import { beforeEach, describe, expect, it, vi } from 'vitest'

const deleteCommentReplyMock = vi.hoisted(() => vi.fn())
const useMutationMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/comments', () => ({
  deleteCommentReply: deleteCommentReplyMock,
}))

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

describe('useCommentReplyDeleteApi', () => {
  beforeEach(() => {
    vi.resetModules()
    deleteCommentReplyMock.mockReset()
    useMutationMock.mockReset()
  })

  it('initializes useMutation with deleteCommentReply API and exposes deleteReply and isDeleteLoading', async () => {
    // Purpose: verify hook sets up mutation with correct API function and exposes mutateAsync and loading state.
    const mutateAsyncSpy = vi.fn()
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
      isPending: false,
    })

    const { useCommentReplyDeleteApi } = await import('@/hooks/useCommentReplyDeleteApi')
    const { deleteReply, isDeleteLoading } = useCommentReplyDeleteApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    const options = useMutationMock.mock.calls[0]?.[0]
    expect(options).toEqual({ mutationFn: deleteCommentReplyMock })

    expect(deleteReply).toBe(mutateAsyncSpy)
    expect(isDeleteLoading).toBe(false)
  })

  it('reflects isPending state from useMutation', async () => {
    // Purpose: verify isDeleteLoading mirrors the pending state from useMutation.
    useMutationMock.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: true,
    })

    const { useCommentReplyDeleteApi } = await import('@/hooks/useCommentReplyDeleteApi')
    const { isDeleteLoading } = useCommentReplyDeleteApi()

    expect(isDeleteLoading).toBe(true)
  })

  it('can be called with comment reply delete data', async () => {
    // Purpose: verify deleteReply can be invoked with proper parameters.
    const mutateAsyncSpy = vi.fn().mockResolvedValue({ resultCode: 1 })
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
      isPending: false,
    })

    const { useCommentReplyDeleteApi } = await import('@/hooks/useCommentReplyDeleteApi')
    const { deleteReply } = useCommentReplyDeleteApi()

    const testData = {
      reviewId: 123,
    }

    await deleteReply(testData)

    expect(mutateAsyncSpy).toHaveBeenCalledTimes(1)
    expect(mutateAsyncSpy).toHaveBeenCalledWith(testData)
  })
})
