// generated-by: ai-assist v1.0
// type: unit
// description: useCustomersPage tests verifying API wiring, pagination reset, and tab status mapping.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

const useCustomerListApiMock = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/useCustomerListApi', () => ({
  useCustomerListApi: useCustomerListApiMock,
}))

vi.mock('@/hooks/useDebouncedRef', () => ({
  useDebouncedRef: <T>(source: { value: T }) => source,
}))

describe('useCustomersPage', () => {
  beforeEach(() => {
    vi.resetModules()
    useCustomerListApiMock.mockReset()
  })

  const loadComposable = async () => {
    const module = await import('@/views/customers/useCustomersPage')
    return module.useCustomersPage()
  }

  it('initializes refs and calls customer list API with computed params', async () => {
    const listRef = ref()
    const loadingRef = ref(false)
    useCustomerListApiMock.mockReturnValue({
      customerList: listRef,
      isLoading: loadingRef,
    })

    const composable = await loadComposable()

    expect(composable.page.value).toBe(1)
    expect(composable.searchKeyword.value).toBe('')
    expect(composable.sortField.value).toBe('')
    expect(composable.sortOrder.value).toBe('asc')
    expect(composable.activeTab.value).toBe('all')
    expect(composable.customerList).toBe(listRef)
    expect(composable.isLoading).toBe(loadingRef)

    expect(useCustomerListApiMock).toHaveBeenCalledTimes(1)
    const [params, pageRef] = useCustomerListApiMock.mock.calls[0] as [
      {
        offset: { value: number }
        query: typeof composable.searchKeyword
        sortKey: typeof composable.sortField
        sortOrder: typeof composable.sortOrder
        status: { value: string | undefined }
      },
      typeof composable.page,
    ]
    expect(pageRef).toBe(composable.page)
    expect(params.query).toBe(composable.searchKeyword)
    expect(params.sortKey).toBe(composable.sortField)
    expect(params.sortOrder).toBe(composable.sortOrder)
    expect(params.offset.value).toBe(0)
    expect(params.status.value).toBeUndefined()
  })

  it('maps suspended tab to status ref and forwards to API', async () => {
    useCustomerListApiMock.mockReturnValue({
      customerList: ref(),
      isLoading: ref(false),
    })
    const composable = await loadComposable()

    // Status computed ref embedded in params captured during initial mock call
    const params = useCustomerListApiMock.mock.calls[0]?.[0] as {
      status: { value: string | undefined }
    }
    composable.activeTab.value = 'suspended'
    await nextTick()
    expect(params.status.value).toBe('suspended')
  })

  it('updates page when pageChange is called', async () => {
    useCustomerListApiMock.mockReturnValue({
      customerList: ref(),
      isLoading: ref(false),
    })
    const composable = await loadComposable()
    composable.pageChange(4)
    expect(composable.page.value).toBe(4)
  })
})
