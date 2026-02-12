// generated-by: ai-assist v1.0
// type: unit
// description: useCustomerDetailPage tests covering customer detail API wiring, comment list management, pagination, search, tabs, and hide all comments functionality.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

const useRouteMock = vi.hoisted(() => vi.fn())

const useCustomerDetailApiMock = vi.hoisted(() => vi.fn())
const useCommentListApiMock = vi.hoisted(() => vi.fn())
const useCommentDisplayStatusApiMock = vi.hoisted(() => vi.fn())
const useDebouncedRefMock = vi.hoisted(() => vi.fn())
const elMessageSuccessMock = vi.hoisted(() => vi.fn())

vi.mock('vue-router', () => ({
  useRoute: useRouteMock,
}))

vi.mock('@/hooks/useCustomerDetailApi', () => ({
  useCustomerDetailApi: useCustomerDetailApiMock,
}))

vi.mock('@/hooks/useCommentListApi', () => ({
  useCommentListApi: useCommentListApiMock,
}))

vi.mock('@/hooks/useCommentDisplayStatusApi', () => ({
  useCommentDisplayStatusApi: useCommentDisplayStatusApiMock,
}))

vi.mock('@/hooks/useDebouncedRef', () => ({
  useDebouncedRef: useDebouncedRefMock,
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: elMessageSuccessMock,
  },
}))

describe('useCustomerDetailPage', () => {
  beforeEach(() => {
    vi.resetModules()
    useRouteMock.mockReset()
    useCustomerDetailApiMock.mockReset()
    useCommentListApiMock.mockReset()
    useCommentDisplayStatusApiMock.mockReset()
    useDebouncedRefMock.mockReset()
    elMessageSuccessMock.mockReset()
  })

  const loadComposable = async () => {
    const module = await import('@/views/customers/useCustomerDetailPage')
    return module.useCustomerDetailPage()
  }

  it('initializes state and calls APIs with route id', async () => {
    // Purpose: verify composable initializes refs and wires customer detail and comment list APIs.
    useRouteMock.mockReturnValue({
      params: { id: '123' },
    })

    const customerDetailRef = ref({
      userId: 'C-123',
      nickname: 'テストユーザー',
      status: 'active',
    })
    const isLoadingDetailRef = ref(false)
    const commentListRef = ref({
      totalCount: 10,
      comments: [],
    })
    const isLoadingCommentsRef = ref(false)
    const refetchCommentsMock = vi.fn()
    const debouncedQueryRef = ref('')

    useCustomerDetailApiMock.mockReturnValue({
      customerDetail: customerDetailRef,
      isLoading: isLoadingDetailRef,
    })

    useCommentListApiMock.mockReturnValue({
      commentList: commentListRef,
      isLoading: isLoadingCommentsRef,
      refetch: refetchCommentsMock,
    })

    useDebouncedRefMock.mockReturnValue(debouncedQueryRef)

    useCommentDisplayStatusApiMock.mockReturnValue({
      updateDisplayStatus: vi.fn(),
    })

    const composable = await loadComposable()

    expect(composable.page.value).toBe(1)
    expect(composable.searchKeyword.value).toBe('')
    expect(composable.activeTab.value).toBe('all')
    expect(composable.sortField.value).toBe('reviewId')
    expect(composable.sortOrder.value).toBe('desc')
    expect(composable.customerDetail).toBe(customerDetailRef)
    expect(composable.commentList).toBe(commentListRef)
    expect(composable.isLoading.value).toBe(false)
    expect(composable.isEmpty.value).toBe(false)
    expect(composable.tabs).toEqual([
      { label: 'すべて', name: 'all' },
      { label: '非表示コメント', name: 'hidden' },
    ])

    expect(useCustomerDetailApiMock).toHaveBeenCalledTimes(1)
    const userIdRef = useCustomerDetailApiMock.mock.calls[0]?.[0] as { value: number }
    expect(userIdRef.value).toBe(123)

    expect(useCommentListApiMock).toHaveBeenCalledTimes(1)
    const [commentParams, pageRef] = useCommentListApiMock.mock.calls[0] as [
      {
        query: { value: string }
        userId: { value: number }
        offset: { value: number }
        limit: { value: number }
        commentType: { value: string }
        sortKey: { value: string }
        sortOrder: { value: string }
      },
      { value: number },
    ]
    expect(pageRef).toBe(composable.page)
    expect(commentParams.userId.value).toBe(123)
    expect(commentParams.query).toBe(debouncedQueryRef)
    expect(commentParams.sortKey).toBe(composable.sortField)
    expect(commentParams.sortOrder).toBe(composable.sortOrder)
  })

  it('computes userId as 0 when route id is invalid', async () => {
    // Purpose: ensure userId defaults to 0 for non-numeric route params.
    useRouteMock.mockReturnValue({
      params: { id: 'invalid' },
    })

    const customerDetailRef = ref(null)
    useCustomerDetailApiMock.mockReturnValue({
      customerDetail: customerDetailRef,
      isLoading: ref(false),
    })

    useCommentListApiMock.mockReturnValue({
      commentList: ref({ totalCount: 0, comments: [] }),
      isLoading: ref(false),
      refetch: vi.fn(),
    })

    useDebouncedRefMock.mockReturnValue(ref(''))

    useCommentDisplayStatusApiMock.mockReturnValue({
      updateDisplayStatus: vi.fn(),
    })

    await loadComposable()

    expect(useCustomerDetailApiMock).toHaveBeenCalledTimes(1)
    const userIdRef = useCustomerDetailApiMock.mock.calls[0]?.[0] as { value: number }
    expect(userIdRef.value).toBe(0)
  })

  it('computes isEmpty as true when not loading and customerDetail is null', async () => {
    // Purpose: verify isEmpty computed returns true when customer detail is missing.
    useRouteMock.mockReturnValue({
      params: { id: '123' },
    })

    useCustomerDetailApiMock.mockReturnValue({
      customerDetail: ref(null),
      isLoading: ref(false),
    })

    useCommentListApiMock.mockReturnValue({
      commentList: ref({ totalCount: 0, comments: [] }),
      isLoading: ref(false),
      refetch: vi.fn(),
    })

    useDebouncedRefMock.mockReturnValue(ref(''))

    useCommentDisplayStatusApiMock.mockReturnValue({
      updateDisplayStatus: vi.fn(),
    })

    const composable = await loadComposable()

    expect(composable.isEmpty.value).toBe(true)
  })

  it('computes isLoading as true when both detail and comments are loading', async () => {
    // Purpose: verify isLoading is true when both detail and comments are loading.
    useRouteMock.mockReturnValue({
      params: { id: '123' },
    })

    useCustomerDetailApiMock.mockReturnValue({
      customerDetail: ref({ userId: 'C-123' }),
      isLoading: ref(true),
    })

    useCommentListApiMock.mockReturnValue({
      commentList: ref({ totalCount: 0, comments: [] }),
      isLoading: ref(true),
      refetch: vi.fn(),
    })

    useDebouncedRefMock.mockReturnValue(ref(''))

    useCommentDisplayStatusApiMock.mockReturnValue({
      updateDisplayStatus: vi.fn(),
    })

    const composable = await loadComposable()

    expect(composable.isLoading.value).toBe(true)
  })

  it('computes commentType based on activeTab', async () => {
    // Purpose: verify commentType switches between All and Hidden based on activeTab.
    useRouteMock.mockReturnValue({
      params: { id: '123' },
    })

    useCustomerDetailApiMock.mockReturnValue({
      customerDetail: ref({ userId: 'C-123' }),
      isLoading: ref(false),
    })

    let capturedCommentType: { value: string } | undefined
    useCommentListApiMock.mockImplementation((params) => {
      capturedCommentType = params.commentType
      return {
        commentList: ref({ totalCount: 0, comments: [] }),
        isLoading: ref(false),
        refetch: vi.fn(),
      }
    })

    useDebouncedRefMock.mockReturnValue(ref(''))

    useCommentDisplayStatusApiMock.mockReturnValue({
      updateDisplayStatus: vi.fn(),
    })

    const composable = await loadComposable()

    expect(capturedCommentType?.value).toBe('all')

    composable.activeTab.value = 'hidden'
    await nextTick()
    expect(capturedCommentType?.value).toBe('hidden')
  })

  it('resets page to 1 when searchKeyword changes', async () => {
    // Purpose: verify page resets when debounced query changes.
    useRouteMock.mockReturnValue({
      params: { id: '123' },
    })

    useCustomerDetailApiMock.mockReturnValue({
      customerDetail: ref({ userId: 'C-123' }),
      isLoading: ref(false),
    })

    const debouncedQueryRef = ref('')
    useDebouncedRefMock.mockReturnValue(debouncedQueryRef)

    useCommentListApiMock.mockReturnValue({
      commentList: ref({ totalCount: 0, comments: [] }),
      isLoading: ref(false),
      refetch: vi.fn(),
    })

    useCommentDisplayStatusApiMock.mockReturnValue({
      updateDisplayStatus: vi.fn(),
    })

    const composable = await loadComposable()

    composable.page.value = 3
    debouncedQueryRef.value = 'new search'
    await nextTick()

    expect(composable.page.value).toBe(1)
  })

  it('resets page to 1 when activeTab changes', async () => {
    // Purpose: verify page resets when switching between tabs.
    useRouteMock.mockReturnValue({
      params: { id: '123' },
    })

    useCustomerDetailApiMock.mockReturnValue({
      customerDetail: ref({ userId: 'C-123' }),
      isLoading: ref(false),
    })

    useCommentListApiMock.mockReturnValue({
      commentList: ref({ totalCount: 0, comments: [] }),
      isLoading: ref(false),
      refetch: vi.fn(),
    })

    useDebouncedRefMock.mockReturnValue(ref(''))

    useCommentDisplayStatusApiMock.mockReturnValue({
      updateDisplayStatus: vi.fn(),
    })

    const composable = await loadComposable()

    composable.page.value = 5
    composable.activeTab.value = 'hidden'
    await nextTick()

    expect(composable.page.value).toBe(1)
  })

  it('updates page when pageChange is called', async () => {
    // Purpose: verify pageChange handler updates page ref.
    useRouteMock.mockReturnValue({
      params: { id: '123' },
    })

    useCustomerDetailApiMock.mockReturnValue({
      customerDetail: ref({ userId: 'C-123' }),
      isLoading: ref(false),
    })

    useCommentListApiMock.mockReturnValue({
      commentList: ref({ totalCount: 0, comments: [] }),
      isLoading: ref(false),
      refetch: vi.fn(),
    })

    useDebouncedRefMock.mockReturnValue(ref(''))

    useCommentDisplayStatusApiMock.mockReturnValue({
      updateDisplayStatus: vi.fn(),
    })

    const composable = await loadComposable()

    composable.pageChange(2)
    expect(composable.page.value).toBe(2)

    composable.pageChange(5)
    expect(composable.page.value).toBe(5)
  })

  it('handleHideAllComments calls API, shows success message, and refetches comments', async () => {
    // Purpose: verify hide all comments flow calls display status API and refreshes list.
    useRouteMock.mockReturnValue({
      params: { id: '123' },
    })

    useCustomerDetailApiMock.mockReturnValue({
      customerDetail: ref({ userId: 'C-123' }),
      isLoading: ref(false),
    })

    const refetchCommentsMock = vi.fn()
    useCommentListApiMock.mockReturnValue({
      commentList: ref({ totalCount: 0, comments: [] }),
      isLoading: ref(false),
      refetch: refetchCommentsMock,
    })

    useDebouncedRefMock.mockReturnValue(ref(''))

    const updateDisplayStatusMock = vi.fn().mockResolvedValue(undefined)
    useCommentDisplayStatusApiMock.mockReturnValue({
      updateDisplayStatus: updateDisplayStatusMock,
    })

    const composable = await loadComposable()

    await composable.handleHideAllComments()

    expect(updateDisplayStatusMock).toHaveBeenCalledTimes(1)
    expect(updateDisplayStatusMock).toHaveBeenCalledWith({
      idType: 'user',
      targetId: 123,
      displayFlag: 0,
    })
    expect(elMessageSuccessMock).toHaveBeenCalledTimes(1)
    expect(refetchCommentsMock).toHaveBeenCalledTimes(1)
  })

  it('handleHideAllComments handles errors gracefully without refetching', async () => {
    // Purpose: verify error handling in hide all comments does not break state.
    useRouteMock.mockReturnValue({
      params: { id: '123' },
    })

    useCustomerDetailApiMock.mockReturnValue({
      customerDetail: ref({ userId: 'C-123' }),
      isLoading: ref(false),
    })

    const refetchCommentsMock = vi.fn()
    useCommentListApiMock.mockReturnValue({
      commentList: ref({ totalCount: 0, comments: [] }),
      isLoading: ref(false),
      refetch: refetchCommentsMock,
    })

    useDebouncedRefMock.mockReturnValue(ref(''))

    const updateDisplayStatusMock = vi.fn().mockRejectedValue(new Error('API Error'))
    useCommentDisplayStatusApiMock.mockReturnValue({
      updateDisplayStatus: updateDisplayStatusMock,
    })

    const composable = await loadComposable()

    await expect(composable.handleHideAllComments()).rejects.toThrow('API Error')

    expect(updateDisplayStatusMock).toHaveBeenCalledTimes(1)
    expect(elMessageSuccessMock).not.toHaveBeenCalled()
    expect(refetchCommentsMock).not.toHaveBeenCalled()
  })
})
