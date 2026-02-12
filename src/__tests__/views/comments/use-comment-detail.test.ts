// generated-by: ai-assist v1.0
// type: unit
// description: useCommentDetail tests covering initialization, reply state transitions, and navigation handlers.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { routeNames } from '@/router/routes'

const useRouteMock = vi.hoisted(() => vi.fn())
const useRouterMock = vi.hoisted(() => vi.fn())
const useCommentDetailApiMock = vi.hoisted(() => vi.fn())
const useCommentReplyApiMock = vi.hoisted(() => vi.fn())
const useCommentReplyDeleteApiMock = vi.hoisted(() => vi.fn())

vi.mock('vue-router', () => ({
  useRoute: useRouteMock,
  useRouter: useRouterMock,
}))

vi.mock('@/hooks/useCommentDetailApi', () => ({
  useCommentDetailApi: useCommentDetailApiMock,
}))

vi.mock('@/hooks/useCommentReplyApi', () => ({
  useCommentReplyApi: useCommentReplyApiMock,
}))

vi.mock('@/hooks/useCommentReplyDeleteApi', () => ({
  useCommentReplyDeleteApi: useCommentReplyDeleteApiMock,
}))

describe('useCommentDetail', () => {
  const pushMock = vi.fn()
  const refetchMock = vi.fn()
  const submitReplyMock = vi.fn()
  const deleteReplyMock = vi.fn()
  const commentDetailRef = ref({
    projectId: 456,
    userId: 789,
    nickName: 'Test User',
    reply: '',
  })
  const isLoadingRef = ref(false)

  beforeEach(() => {
    vi.resetModules()
    useRouteMock.mockReset()
    useRouterMock.mockReset()
    useCommentDetailApiMock.mockReset()
    useCommentReplyApiMock.mockReset()
    useCommentReplyDeleteApiMock.mockReset()
    pushMock.mockReset()
    refetchMock.mockReset()
    submitReplyMock.mockReset()
    deleteReplyMock.mockReset()
    commentDetailRef.value = {
      projectId: 456,
      userId: 789,
      nickName: 'Test User',
      reply: '',
    }
    isLoadingRef.value = false
  })

  const loadComposable = async () => {
    useRouteMock.mockReturnValue({ params: { id: '1' } })
    useRouterMock.mockReturnValue({ push: pushMock })
    useCommentDetailApiMock.mockReturnValue({
      commentDetail: commentDetailRef,
      isLoading: isLoadingRef,
      refetch: refetchMock,
    })
    useCommentReplyApiMock.mockReturnValue({
      submitReply: submitReplyMock,
    })
    useCommentReplyDeleteApiMock.mockReturnValue({
      deleteReply: deleteReplyMock,
      isDeleteLoading: ref(false),
    })
    const module = await import('@/views/comments/useCommentDetail')
    return module.useCommentDetail()
  }

  it('initializes state and calls useCommentDetailApi with computed comment id', async () => {
    const composable = await loadComposable()

    expect(useCommentDetailApiMock).toHaveBeenCalledTimes(1)
    const idRef = useCommentDetailApiMock.mock.calls[0]?.[0]
    expect(idRef?.value).toBe(1)

    expect(composable.commentDetail).toBe(commentDetailRef)
    expect(composable.isLoading).toBe(isLoadingRef)
    expect(composable.commentReplyVisible.value).toBe(false)
    expect(composable.commentReplySuccessVisible.value).toBe(false)
    expect(composable.submittedReplyContent.value).toBe('')
    expect(composable.isReply.value).toBe(false)
    expect(composable.isPending.value).toBe(false)
  }, 10000)

  it('handleReply opens dialog', async () => {
    const composable = await loadComposable()

    composable.handleReply()
    expect(composable.commentReplyVisible.value).toBe(true)

    commentDetailRef.value.reply = 'Existing reply'
    composable.commentReplyVisible.value = false
    composable.handleReply()
    expect(composable.commentReplyVisible.value).toBe(true)
  })

  it('handleCloseDialog hides dialog', async () => {
    const composable = await loadComposable()
    composable.commentReplyVisible.value = true

    composable.handleCloseDialog()

    expect(composable.commentReplyVisible.value).toBe(false)
  })

  it('handleSubmitReply calls API and updates state on success', async () => {
    const composable = await loadComposable()
    submitReplyMock.mockResolvedValue({
      reply: 'Reply content',
    })
    refetchMock.mockResolvedValue(undefined)

    await composable.handleSubmitReply('Reply content')

    expect(submitReplyMock).toHaveBeenCalledWith({
      reviewId: 1,
      reply: 'Reply content',
    })
    expect(composable.commentReplyVisible.value).toBe(false)
    expect(composable.submittedReplyContent.value).toBe('Reply content')
    expect(composable.commentReplySuccessVisible.value).toBe(true)
    expect(refetchMock).toHaveBeenCalled()
  })

  it('handleDeleteReply calls API and refetches on success', async () => {
    const composable = await loadComposable()
    commentDetailRef.value.reply = 'Existing reply'
    deleteReplyMock.mockResolvedValue({ resultCode: 1 })
    refetchMock.mockResolvedValue(undefined)

    await composable.handleDeleteReply()

    expect(deleteReplyMock).toHaveBeenCalledWith({
      reviewId: 1,
    })
    expect(refetchMock).toHaveBeenCalled()
  })

  it('handleSubmitReply does not update state on API failure', async () => {
    const composable = await loadComposable()
    submitReplyMock.mockRejectedValue(new Error('API Error'))
    composable.commentReplyVisible.value = true

    await expect(composable.handleSubmitReply('Reply content')).rejects.toThrow('API Error')

    expect(composable.commentReplyVisible.value).toBe(true)
    expect(composable.commentReplySuccessVisible.value).toBe(false)
    expect(composable.isPending.value).toBe(true)
  })

  it('handleDeleteReply does not refetch on API failure', async () => {
    const composable = await loadComposable()
    deleteReplyMock.mockRejectedValue(new Error('API Error'))

    await expect(composable.handleDeleteReply()).rejects.toThrow('API Error')

    expect(refetchMock).not.toHaveBeenCalled()
  })

  it('handleCloseSuccessDialog closes success dialog and clears content', async () => {
    const composable = await loadComposable()
    composable.commentReplySuccessVisible.value = true
    composable.submittedReplyContent.value = 'Submitted reply'

    composable.handleCloseSuccessDialog()

    expect(composable.commentReplySuccessVisible.value).toBe(false)
    expect(composable.submittedReplyContent.value).toBe('')
  })

  it('isReply computed returns true when reply exists and is not empty', async () => {
    const composable = await loadComposable()
    expect(composable.isReply.value).toBe(false)

    commentDetailRef.value.reply = 'Existing reply'
    expect(composable.isReply.value).toBe(true)

    commentDetailRef.value.reply = '   '
    expect(composable.isReply.value).toBe(false)
  })

  it('navigates to associated project and customer when ids exist', async () => {
    const composable = await loadComposable()

    composable.handleProjectClick()
    expect(pushMock).toHaveBeenCalledWith({
      name: routeNames.projects.detail,
      params: { id: '456' },
    })

    composable.handleCustomerClick()
    expect(pushMock).toHaveBeenCalledWith({
      name: routeNames.customers.detail,
      params: { id: '789' },
    })
  })

  it('does not navigate when IDs are missing', async () => {
    commentDetailRef.value = {} as never
    const composable = await loadComposable()

    composable.handleProjectClick()
    composable.handleCustomerClick()

    expect(pushMock).not.toHaveBeenCalled()
  })
})
