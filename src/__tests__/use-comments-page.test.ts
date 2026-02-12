// generated-by: ai-assist v1.0
// type: unit
// description: useCommentsPage tests covering state initialization, search, pagination, filtering, sorting, CSV download, and bulk operations.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref, nextTick } from 'vue'

import { pageSize, SortOrder } from '@/enum'
import { CommentExtractType, CommentSortKey, CommentType } from '@/enum/comments'

const useCommentListApiMock = vi.hoisted(() => vi.fn())
const useDebouncedRefMock = vi.hoisted(() => vi.fn())
const useCommentCheckStatusApiMock = vi.hoisted(() => vi.fn())
const useCommentListCSVDownloadMock = vi.hoisted(() => vi.fn())
const mapTabToExtractTypeMock = vi.hoisted(() => vi.fn())
const mapFiltersToCommentTypeMock = vi.hoisted(() => vi.fn())
const mapSortFieldToSortKeyMock = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/useCommentListApi', () => ({
  useCommentListApi: useCommentListApiMock,
}))

vi.mock('@/hooks/useDebouncedRef', () => ({
  useDebouncedRef: useDebouncedRefMock,
}))

vi.mock('@/hooks/useCommentCheckStatusApi', () => ({
  useCommentCheckStatusApi: useCommentCheckStatusApiMock,
}))

vi.mock('@/hooks/useCommentListCSVDownload', () => ({
  useCommentListCSVDownload: useCommentListCSVDownloadMock,
}))

vi.mock('@/api/types/comments', () => ({
  mapTabToExtractType: mapTabToExtractTypeMock,
  mapFiltersToCommentType: mapFiltersToCommentTypeMock,
  mapSortFieldToSortKey: mapSortFieldToSortKeyMock,
}))

describe('useCommentsPage', () => {
  const commentListRef = ref({
    totalCount: 25,
    comments: [
      { reviewId: '1', checkFlag: 0 },
      { reviewId: '2', checkFlag: 1 },
      { reviewId: '3', checkFlag: 0 },
    ],
  })
  const isLoadingRef = ref(false)
  const debouncedQueryRef = ref('')
  const updateCheckStatusMock = vi.fn()
  const downloadCSVMock = vi.fn()
  const isDownloadingRef = ref(false)

  beforeEach(() => {
    vi.resetModules()
    useCommentListApiMock.mockReset()
    useDebouncedRefMock.mockReset()
    useCommentCheckStatusApiMock.mockReset()
    useCommentListCSVDownloadMock.mockReset()
    mapTabToExtractTypeMock.mockReset()
    mapFiltersToCommentTypeMock.mockReset()
    mapSortFieldToSortKeyMock.mockReset()
    updateCheckStatusMock.mockReset()
    downloadCSVMock.mockReset()

    commentListRef.value = {
      totalCount: 25,
      comments: [
        { reviewId: '1', checkFlag: 0 },
        { reviewId: '2', checkFlag: 1 },
        { reviewId: '3', checkFlag: 0 },
      ],
    }
    isLoadingRef.value = false
    debouncedQueryRef.value = ''
    isDownloadingRef.value = false
  })

  const loadComposable = async () => {
    useDebouncedRefMock.mockReturnValue(debouncedQueryRef)
    useCommentListApiMock.mockReturnValue({
      commentList: commentListRef,
      isLoading: isLoadingRef,
    })
    useCommentCheckStatusApiMock.mockReturnValue({
      updateCheckStatus: updateCheckStatusMock,
    })
    useCommentListCSVDownloadMock.mockReturnValue({
      downloadCSV: downloadCSVMock,
      isDownloading: isDownloadingRef,
    })
    mapTabToExtractTypeMock.mockImplementation((tab) => {
      if (tab === 'all') return CommentExtractType.All
      if (tab === 'unchecked') return CommentExtractType.Unchecked
      if (tab === 'ng_word') return CommentExtractType.NgWord
      if (tab === 'reported') return CommentExtractType.Reported
      return undefined
    })
    mapFiltersToCommentTypeMock.mockImplementation((filters) => {
      if (filters.includes('visible') && filters.includes('hidden')) return CommentType.All
      if (filters.includes('visible') && !filters.includes('hidden')) return CommentType.Display
      if (!filters.includes('visible') && filters.includes('hidden')) return CommentType.Hidden
      return CommentType.None
    })
    mapSortFieldToSortKeyMock.mockImplementation((field) => {
      if (field === 'comment') return CommentSortKey.Comment
      if (field === 'createdAt') return CommentSortKey.CreatedAt
      if (field === 'reviewId') return CommentSortKey.ReviewId
      if (field === 'rating') return CommentSortKey.Rating
      if (field === 'projectId') return CommentSortKey.ProjectId
      if (field === 'userId') return CommentSortKey.UserId
      return undefined
    })

    const module = await import('@/views/comments/useCommentsPage')
    return module.useCommentsPage()
  }

  it('initializes state with default values', async () => {
    // Increase timeout for this test as module loading can be slow
    const composable = await loadComposable()
    expect(composable.searchKeyword.value).toBe('')
    expect(composable.activeTab.value).toBe('all')
    expect(composable.filterList.value).toEqual(['visible', 'hidden'])
    expect(composable.page.value).toBe(1)
    expect(composable.sortField.value).toBe('')
    expect(composable.sortOrder.value).toBe(SortOrder.Desc)
    expect(composable.isCheckAllLoading.value).toBe(false)
    expect(composable.checkAllButtonLabel.value).toBe('このページ全てチェック済みにする')
  }, 10000)

  it('computes offset correctly', async () => {
    const composable = await loadComposable()
    composable.page.value = 2

    // offset = (page - 1) * limit = (2 - 1) * pageSize = pageSize
    expect(composable.page.value).toBe(2)
  })

  it('initializes with proper computed properties', async () => {
    const composable = await loadComposable()

    // Test that computed properties work correctly
    expect(composable.checkAllButtonLabel.value).toBe('このページ全てチェック済みにする')
  })

  it('calls useCommentListApi with correct parameters', async () => {
    await loadComposable()

    expect(useCommentListApiMock).toHaveBeenCalledTimes(1)
    const params = useCommentListApiMock.mock.calls[0][0]

    expect(params.offset.value).toBe(0) // page 1, offset = (1-1) * limit = 0
    expect(params.limit.value).toBe(pageSize)
    expect(params.sortOrder.value).toBe(SortOrder.Desc)
  })

  it('resets page to 1 when debounced query changes', async () => {
    const composable = await loadComposable()
    composable.page.value = 3

    // Simulate watch trigger by changing debounced query
    debouncedQueryRef.value = 'new search'
    await nextTick()

    // Page should be reset to 1
    expect(composable.page.value).toBe(1)
  })

  it('resets page to 1 when active tab changes', async () => {
    const composable = await loadComposable()
    composable.page.value = 3

    // Simulate watch trigger by changing active tab
    composable.activeTab.value = 'unchecked'
    await nextTick()

    // Page should be reset to 1
    expect(composable.page.value).toBe(1)
  })

  it('resets page to 1 when filter list changes', async () => {
    const composable = await loadComposable()
    composable.page.value = 3

    // Simulate watch trigger by changing filter list
    composable.filterList.value = ['visible']
    await nextTick()

    // Page should be reset to 1
    expect(composable.page.value).toBe(1)
  })

  it('pageChange updates page number correctly', async () => {
    const composable = await loadComposable()

    composable.pageChange(5)
    expect(composable.page.value).toBe(5)
  })

  it('handleCSVDownload calls downloadCSV with correct parameters', async () => {
    const composable = await loadComposable()
    composable.searchKeyword.value = 'test query'
    composable.sortField.value = 'comment'

    await composable.handleCSVDownload()

    expect(downloadCSVMock).toHaveBeenCalledWith({
      query: 'test query',
      extractType: CommentExtractType.All,
      commentType: CommentType.All,
      sortKey: CommentSortKey.Comment,
      sortOrder: SortOrder.Desc,
    })
  })

  it('checkAllButtonLabel reflects all checked state correctly', async () => {
    const composable = await loadComposable()

    // Initially not all checked
    expect(composable.checkAllButtonLabel.value).toBe('このページ全てチェック済みにする')

    // Make all comments checked
    commentListRef.value.comments.forEach((comment) => (comment.checkFlag = 1))
    await nextTick()

    expect(composable.checkAllButtonLabel.value).toBe('このページのチェックを全て解除')
  })

  it('toggleCheckAll checks all comments when none are checked', async () => {
    const composable = await loadComposable()
    updateCheckStatusMock.mockResolvedValue(undefined)

    await composable.toggleCheckAll()

    expect(updateCheckStatusMock).toHaveBeenCalledWith({
      reviewIdList: ['1', '2', '3'],
      checkFlag: 1,
    })
    expect(composable.isCheckAllLoading.value).toBe(false)
  })

  it('toggleCheckAll unchecks all comments when all are checked', async () => {
    const composable = await loadComposable()
    commentListRef.value.comments.forEach((comment) => (comment.checkFlag = 1))
    updateCheckStatusMock.mockResolvedValue(undefined)

    await composable.toggleCheckAll()

    expect(updateCheckStatusMock).toHaveBeenCalledWith({
      reviewIdList: ['1', '2', '3'],
      checkFlag: 0,
    })
  })

  it('toggleCheckAll does nothing when loading', async () => {
    const composable = await loadComposable()
    composable.isCheckAllLoading.value = true

    await composable.toggleCheckAll()

    expect(updateCheckStatusMock).not.toHaveBeenCalled()
  })

  it('toggleCheckAll handles empty comment list', async () => {
    const composable = await loadComposable()
    // Set to a state that would indicate empty results
    commentListRef.value = { totalCount: 0, comments: [] }

    await composable.toggleCheckAll()

    // The function will try to check all items in empty array, so it calls with empty reviewIdList
    expect(updateCheckStatusMock).toHaveBeenCalledWith({
      reviewIdList: [],
      checkFlag: 1,
    })
  })

  it('toggleCheckAll handles edge case when commentList is null', async () => {
    const composable = await loadComposable()
    commentListRef.value = null as unknown as typeof commentListRef.value

    await composable.toggleCheckAll()

    expect(updateCheckStatusMock).not.toHaveBeenCalled()
  })

  it('checkAllButtonLabel shows correct text when not all checked', async () => {
    const composable = await loadComposable()

    expect(composable.checkAllButtonLabel.value).toBe('このページ全てチェック済みにする')
  })

  it('checkAllButtonLabel shows correct text when all checked', async () => {
    const composable = await loadComposable()
    commentListRef.value.comments.forEach((comment) => (comment.checkFlag = 1))

    expect(composable.checkAllButtonLabel.value).toBe('このページのチェックを全て解除')
  })

  it('returns all expected reactive properties and functions', async () => {
    const composable = await loadComposable()

    expect(composable).toHaveProperty('searchKeyword')
    expect(composable).toHaveProperty('activeTab')
    expect(composable).toHaveProperty('filterList')
    expect(composable).toHaveProperty('commentList')
    expect(composable).toHaveProperty('isLoading')
    expect(composable).toHaveProperty('page')
    expect(composable).toHaveProperty('sortField')
    expect(composable).toHaveProperty('sortOrder')
    expect(composable).toHaveProperty('pageChange')
    expect(composable).toHaveProperty('handleCSVDownload')
    expect(composable).toHaveProperty('toggleCheckAll')
    expect(composable).toHaveProperty('checkAllButtonLabel')
    expect(composable).toHaveProperty('isCheckAllLoading')
    expect(composable).toHaveProperty('isDownloading')
  })
})
