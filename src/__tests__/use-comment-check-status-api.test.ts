import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { useMutation } from '@tanstack/vue-query'

import { updateCommentCheckStatus } from '@/api/comments'
import { useCommentCheckStatusApi } from '@/hooks/useCommentCheckStatusApi'

vi.mock('@tanstack/vue-query', () => ({
  useMutation: vi.fn(),
}))

vi.mock('@/api/comments', () => ({
  updateCommentCheckStatus: vi.fn(),
}))

const useMutationMock = useMutation as unknown as Mock

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useCommentCheckStatusApi', () => {
  it('should configure mutation and expose mutate function', async () => {
    const mutateAsync = vi.fn().mockResolvedValue('ok')
    useMutationMock.mockReturnValue({ mutateAsync })

    const { updateCheckStatus } = useCommentCheckStatusApi()

    expect(useMutationMock).toHaveBeenCalledWith({ mutationFn: updateCommentCheckStatus })
    expect(updateCheckStatus).toBe(mutateAsync)

    const payload = { reviewIdList: [1], checkFlag: 1 }
    await updateCheckStatus(payload)
    expect(mutateAsync).toHaveBeenCalledWith(payload)
  })
})
