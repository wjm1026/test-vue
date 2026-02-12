// generated-by: ai-assist v1.0
// type: unit
// description: useCommentReplyApi tests verifying mutation setup and submitReply exposure.

import { beforeEach, describe, expect, it, vi } from 'vitest'

const submitCommentReplyMock = vi.hoisted(() => vi.fn())
const useMutationMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/comments', () => ({
  submitCommentReply: submitCommentReplyMock,
}))

vi.mock('@tanstack/vue-query', () => ({
  useMutation: useMutationMock,
}))

describe('useCommentReplyApi', () => {
  beforeEach(() => {
    vi.resetModules()
    submitCommentReplyMock.mockReset()
    useMutationMock.mockReset()
  })

  it('initializes useMutation with submitCommentReply API and exposes submitReply', async () => {
    // Purpose: verify hook sets up mutation with correct API function and exposes mutateAsync.
    const mutateAsyncSpy = vi.fn()
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
    })

    const { useCommentReplyApi } = await import('@/hooks/useCommentReplyApi')
    const { submitReply } = useCommentReplyApi()

    expect(useMutationMock).toHaveBeenCalledTimes(1)
    const options = useMutationMock.mock.calls[0]?.[0]
    expect(options).toEqual({ mutationFn: submitCommentReplyMock })

    expect(submitReply).toBe(mutateAsyncSpy)
  })

  it('can be called with comment reply data', async () => {
    // Purpose: verify submitReply can be invoked with proper parameters.
    const mutateAsyncSpy = vi.fn().mockResolvedValue({ resultCode: 1 })
    useMutationMock.mockReturnValue({
      mutateAsync: mutateAsyncSpy,
    })

    const { useCommentReplyApi } = await import('@/hooks/useCommentReplyApi')
    const { submitReply } = useCommentReplyApi()

    const testData = {
      reviewId: 123,
      reply: 'This is a test reply',
    }

    await submitReply(testData)

    expect(mutateAsyncSpy).toHaveBeenCalledTimes(1)
    expect(mutateAsyncSpy).toHaveBeenCalledWith(testData)
  })
})
