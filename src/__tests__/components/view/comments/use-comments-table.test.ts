// generated-by: ai-assist v1.0
// type: unit
// description: Tests for useCommentsTable composable covering toggles, guards, and routing helpers.

import { describe, expect, it, beforeEach, vi } from 'vitest'

import message from '@/enum/message.json'
import { routeNames } from '@/router/routes'
import type { Comment } from '@/api/types/comments'

const pushMock = vi.hoisted(() => vi.fn())
const updateCheckStatusMock = vi.hoisted(() => vi.fn())
const updateDisplayStatusMock = vi.hoisted(() => vi.fn())
const messageSuccessMock = vi.hoisted(() => vi.fn())

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('@/hooks/useCommentCheckStatusApi', () => ({
  useCommentCheckStatusApi: () => ({
    updateCheckStatus: updateCheckStatusMock,
  }),
}))

vi.mock('@/hooks/useCommentDisplayStatusApi', () => ({
  useCommentDisplayStatusApi: () => ({
    updateDisplayStatus: updateDisplayStatusMock,
  }),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: messageSuccessMock,
  },
}))

const createRow = (overrides: Partial<Comment> = {}): Comment => ({
  reviewId: 1,
  comment: 'great product',
  rating: 5,
  createdAt: '2024-01-01T00:00:00Z',
  checkFlag: 0,
  displayFlag: 1,
  projectId: 10,
  userId: 20,
  userIconIndex: 1,
  nickname: 'Alice',
  ageGroup: '20s',
  gender: 'female',
  likeCount: 0,
  ...overrides,
})

async function setupComposable() {
  vi.resetModules()
  const module = await import('@/components/view/comments/useCommentsTable')
  return module.useCommentsTable()
}

describe('useCommentsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exposes helpers reflecting check/display flags', async () => {
    const composable = await setupComposable()
    const checkedRow = createRow({ checkFlag: 1 })
    const hiddenRow = createRow({ displayFlag: 0 })

    expect(composable.getIsChecked(checkedRow)).toBe(true)
    expect(composable.getIsChecked(createRow({ checkFlag: 0 }))).toBe(false)
    expect(composable.getIsVisible(hiddenRow)).toBe(false)
    expect(composable.getIsVisible(createRow({ displayFlag: 1 }))).toBe(true)
  })

  it('toggles check flag, calls API, and clears loading state', async () => {
    const composable = await setupComposable()
    const row = createRow({ checkFlag: 0 })
    updateCheckStatusMock.mockResolvedValue(undefined)

    await composable.handleCheckChange(row)

    expect(updateCheckStatusMock).toHaveBeenCalledWith({
      reviewIdList: [row.reviewId],
      checkFlag: 1,
    })
    expect(row.checkFlag).toBe(1)
    expect(messageSuccessMock).toHaveBeenCalledWith(message.comment.checkSuccess)
    expect(composable.loadingRowIds.value.has(row.reviewId)).toBe(false)
  })

  it('skips check updates while a row is loading', async () => {
    const composable = await setupComposable()
    const row = createRow({ reviewId: 2 })
    composable.loadingRowIds.value.add(row.reviewId)

    await composable.handleCheckChange(row)

    expect(updateCheckStatusMock).not.toHaveBeenCalled()
    expect(row.checkFlag).toBe(0)
    expect(composable.loadingRowIds.value.has(row.reviewId)).toBe(true)
  })

  it('updates display flag and handles concurrent guard', async () => {
    const composable = await setupComposable()
    const row = createRow({ displayFlag: 1, reviewId: 3 })
    updateDisplayStatusMock.mockResolvedValue(undefined)

    await composable.handleVisibleChange(row, 0)

    expect(updateDisplayStatusMock).toHaveBeenCalledWith({
      idType: 'comment',
      targetId: row.reviewId,
      displayFlag: 0,
    })
    expect(row.displayFlag).toBe(0)
    expect(messageSuccessMock).toHaveBeenCalledWith(message.comment.displaySuccess)
    expect(composable.loadingDisplayRowIds.value.has(row.reviewId)).toBe(false)

    composable.loadingDisplayRowIds.value.add(row.reviewId)
    await composable.handleVisibleChange(row, true)
    expect(updateDisplayStatusMock).toHaveBeenCalledTimes(1)
    expect(row.displayFlag).toBe(0)
  })

  it('navigates to routed pages when row content is clicked', async () => {
    const composable = await setupComposable()

    composable.handleCommentClick(1)
    composable.handleProjectClick(2)
    composable.handleCustomerClick(3)

    expect(pushMock).toHaveBeenNthCalledWith(1, {
      name: routeNames.comments.detail,
      params: { id: 1 },
    })
    expect(pushMock).toHaveBeenNthCalledWith(2, {
      name: routeNames.projects.detail,
      params: { id: 2 },
    })
    expect(pushMock).toHaveBeenNthCalledWith(3, {
      name: routeNames.customers.detail,
      params: { id: 3 },
    })
  })
})
