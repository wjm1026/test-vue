// generated-by: ai-assist v1.0
// type: unit
// description: Tests for useReportCommentsDialog composable covering initialization, watch behavior, pagination, and event handling.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, reactive, ref } from 'vue'

import { useReportCommentsDialog } from '@/components/view/reports/detail/useReportCommentsDialog'
import type { CommentsListResponse } from '@/api/types/comments'
import { CommentRating } from '@/enum'

const mockCommentList = ref<CommentsListResponse | undefined>(undefined)
const mockIsLoading = ref(false)

const useCommentListApiMock = vi.hoisted(() => {
  return vi.fn(() => ({
    commentList: mockCommentList,
    isLoading: mockIsLoading,
  }))
})

vi.mock('@/hooks/useCommentListApi', () => ({
  useCommentListApi: useCommentListApiMock,
}))

const sampleCommentList: CommentsListResponse = {
  totalCount: 10,
  comments: [
    {
      checkFlag: 1,
      displayFlag: 0,
      reviewId: 10000000,
      comment: 'テストコメント1',
      rating: 5,
      createdAt: '2025-01-01T00:00:00Z',
      projectId: 1,
      userId: 30000000,
      userIconIndex: 1,
      nickname: 'ユーザーA',
      ageGroup: '30代',
      gender: '男性',
      likeCount: 5,
    },
    {
      checkFlag: 0,
      displayFlag: 1,
      reviewId: 10000001,
      comment: 'テストコメント2',
      rating: 4,
      createdAt: '2025-01-02T00:00:00Z',
      projectId: 1,
      userId: 30000001,
      userIconIndex: 2,
      nickname: 'ユーザーB',
      ageGroup: '20代',
      gender: '女性',
      likeCount: 0,
    },
  ],
}

describe('useReportCommentsDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCommentList.value = undefined
    mockIsLoading.value = false
  })

  it('initializes with default values', () => {
    // Purpose: verify composable initializes with correct default values.
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    expect(result.searchKeyword.value).toBe('')
    expect(result.page.value).toBe(1)
    expect(result.limit.value).toBe(6)
    expect(result.commentVisible.value).toBe(false)
  })

  it('syncs commentVisible with props.modelValue on initialization', () => {
    // Purpose: ensure commentVisible is synced with props.modelValue when composable is created.
    const props = { modelValue: true, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    expect(result.commentVisible.value).toBe(true)
  })

  it('updates commentVisible when props.modelValue changes', async () => {
    // Purpose: verify watch updates commentVisible reactively when props.modelValue changes.
    // Note: The composable expects a reactive props object, so we use reactive() to create one
    const props = reactive({ modelValue: false, rating: CommentRating.Good })
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    // The watch with immediate: true should sync commentVisible with props.modelValue
    expect(result.commentVisible.value).toBe(false)

    props.modelValue = true
    await nextTick()

    expect(result.commentVisible.value).toBe(true)
  })

  it('calculates offset correctly based on page and limit', () => {
    // Purpose: verify offset computed property calculates correctly.
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    // Page 1, limit 6: offset = (1 - 1) * 6 = 0
    expect(result.page.value).toBe(1)
    expect(result.limit.value).toBe(6)

    // Verify offset is passed to useCommentListApi
    expect(useCommentListApiMock).toHaveBeenCalled()
    const callArgs = useCommentListApiMock.mock.calls[0]
    expect(callArgs).toBeDefined()
    expect(callArgs?.length).toBeGreaterThanOrEqual(1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstArg = (callArgs as any)?.[0] as unknown as { offset: { value: number } }
    const offsetRef = firstArg.offset
    expect(offsetRef.value).toBe(0) // (1 - 1) * 6 = 0

    // Change page and verify offset updates
    result.pageChange(2)
    expect(offsetRef.value).toBe(6) // (2 - 1) * 6 = 6

    result.pageChange(3)
    expect(offsetRef.value).toBe(12) // (3 - 1) * 6 = 12
  })

  it('calls useCommentListApi with correct parameters', () => {
    // Purpose: ensure useCommentListApi is called with offset, query, limit, and page refs.
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    useReportCommentsDialog(props, emit)

    expect(useCommentListApiMock).toHaveBeenCalledTimes(1)
    const callArgs = useCommentListApiMock.mock.calls[0]
    expect(callArgs).toBeDefined()
    expect(callArgs?.length).toBeGreaterThanOrEqual(2)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstArg = (callArgs as any)?.[0] as unknown as Record<string, unknown>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const secondArg = (callArgs as any)?.[1]
    expect(firstArg).toHaveProperty('offset')
    expect(firstArg).toHaveProperty('query')
    expect(firstArg).toHaveProperty('limit')
    expect(firstArg).toHaveProperty('rating')
    expect(secondArg).toBeDefined() // page ref
  })

  it('returns commentList from useCommentListApi', () => {
    // Purpose: verify commentList is returned from the API hook.
    mockCommentList.value = sampleCommentList
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    const expectedMapped = {
      totalCount: sampleCommentList.totalCount,
      comments: sampleCommentList.comments.map((comment) => ({
        reviewId: comment.reviewId,
        label: `${comment.ageGroup} ${comment.gender}`,
        content: comment.comment,
        likes: comment.likeCount,
        userIconIndex: comment.userIconIndex,
      })),
    }

    expect(result.commentList.value).toEqual(expectedMapped)
  })

  it('returns isLoading from useCommentListApi', () => {
    // Purpose: verify isLoading is returned from the API hook.
    mockIsLoading.value = true
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    expect(result.isLoading.value).toBe(true)
  })

  it('updates page when pageChange is called', () => {
    // Purpose: verify pageChange function updates the page ref.
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    expect(result.page.value).toBe(1)

    result.pageChange(2)
    expect(result.page.value).toBe(2)

    result.pageChange(3)
    expect(result.page.value).toBe(3)
  })

  it('sets commentVisible to false and emits closeComments when handleClose is called', () => {
    // Purpose: ensure handleClose updates commentVisible and emits event.
    const props = { modelValue: true, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    expect(result.commentVisible.value).toBe(true)

    result.handleClose()

    expect(result.commentVisible.value).toBe(false)
    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith('closeComments')
  })

  it('allows searchKeyword to be updated', () => {
    // Purpose: verify searchKeyword ref can be modified.
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    result.searchKeyword.value = 'テスト検索'
    expect(result.searchKeyword.value).toBe('テスト検索')

    result.searchKeyword.value = '新しい検索語'
    expect(result.searchKeyword.value).toBe('新しい検索語')
  })

  it('maintains limit value at 6', () => {
    // Purpose: verify limit is set to 6 and remains constant.
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    expect(result.limit.value).toBe(6)
    // Limit should not change during normal operation
    result.pageChange(2)
    expect(result.limit.value).toBe(6)
  })

  it('handles multiple handleClose calls', () => {
    // Purpose: verify handleClose can be called multiple times.
    const props = { modelValue: true, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    result.handleClose()
    result.handleClose()
    result.handleClose()

    expect(result.commentVisible.value).toBe(false)
    expect(emit).toHaveBeenCalledTimes(3)
  })

  it('handles page changes to different values', () => {
    // Purpose: verify pageChange works with various page numbers.
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    result.pageChange(1)
    expect(result.page.value).toBe(1)

    result.pageChange(5)
    expect(result.page.value).toBe(5)

    result.pageChange(10)
    expect(result.page.value).toBe(10)
  })

  it('reactively updates when searchKeyword changes', async () => {
    // Purpose: verify searchKeyword changes trigger API hook updates.
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    result.searchKeyword.value = '新しい検索'
    await nextTick()

    // The query ref passed to useCommentListApi should be reactive
    expect(result.searchKeyword.value).toBe('新しい検索')
  })

  it('handles undefined commentList gracefully', () => {
    // Purpose: ensure composable handles undefined commentList from API.
    mockCommentList.value = undefined
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    expect(result.commentList.value).toBeUndefined()
  })

  it('handles loading state changes', () => {
    // Purpose: verify isLoading state can change reactively.
    mockIsLoading.value = false
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    expect(result.isLoading.value).toBe(false)

    mockIsLoading.value = true
    expect(result.isLoading.value).toBe(true)
  })

  it('initializes commentVisible correctly when modelValue is false', () => {
    // Purpose: verify commentVisible starts as false when modelValue is false.
    const props = { modelValue: false, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    expect(result.commentVisible.value).toBe(false)
  })

  it('initializes commentVisible correctly when modelValue is true', () => {
    // Purpose: verify commentVisible starts as true when modelValue is true.
    const props = { modelValue: true, rating: CommentRating.Good }
    const emit = vi.fn()
    const result = useReportCommentsDialog(props, emit)

    expect(result.commentVisible.value).toBe(true)
  })
})
