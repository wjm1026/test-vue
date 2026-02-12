import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { useMutation } from '@tanstack/vue-query'

import { updateCommentDisplayStatus } from '@/api/comments'
import { useCommentDisplayStatusApi } from '@/hooks/useCommentDisplayStatusApi'
import type { CommentDisplayStatusRequest } from '@/api/types/comments'

vi.mock('@tanstack/vue-query', () => ({
  useMutation: vi.fn(),
}))

vi.mock('@/api/comments', () => ({
  updateCommentDisplayStatus: vi.fn(),
}))

const useMutationMock = useMutation as unknown as Mock

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useCommentDisplayStatusApi', () => {
  it('should configure mutation and expose mutate function', async () => {
    const mutateAsync = vi.fn().mockResolvedValue('ok')
    useMutationMock.mockReturnValue({ mutateAsync })

    const { updateDisplayStatus } = useCommentDisplayStatusApi()

    expect(useMutationMock).toHaveBeenCalledWith({ mutationFn: updateCommentDisplayStatus })
    expect(updateDisplayStatus).toBe(mutateAsync)

    const payload: CommentDisplayStatusRequest = { idType: 'comment', targetId: 2, displayFlag: 1 }
    await updateDisplayStatus(payload)
    expect(mutateAsync).toHaveBeenCalledWith(payload)
  })
})
