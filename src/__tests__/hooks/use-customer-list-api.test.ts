// generated-by: ai-assist v1.0
// type: unit
// description: useCustomerListApi tests covering query wiring, status forwarding, and watch-driven page reset.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { SortOrder } from '@/enum'

const useQueryMock = vi.hoisted(() => vi.fn())
const getCustomerListMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/customers', () => ({
  getCustomerList: getCustomerListMock,
}))

describe('useCustomerListApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getCustomerListMock.mockReset()
  })

  const loadComposable = async () => {
    const module = await import('@/hooks/useCustomerListApi')
    return module.useCustomerListApi
  }

  it('configures query with offset/query/sort/status refs and forwards params', async () => {
    const params = {
      offset: ref(10),
      query: ref('foo'),
      sortKey: ref('userId'),
      sortOrder: ref<SortOrder>('asc' as SortOrder),
      status: ref<string | undefined>('suspended'),
    }
    const page = ref(2)
    const queryResult = { data: ref(), isFetching: ref(false) }
    useQueryMock.mockReturnValue(queryResult)
    getCustomerListMock.mockResolvedValue({ data: {} })

    const useCustomerListApi = await loadComposable()
    const result = useCustomerListApi(params, page)

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const options = useQueryMock.mock.calls[0]?.[0]
    expect(options?.queryKey).toEqual([
      'customerList',
      params.offset,
      params.query,
      params.sortKey,
      params.sortOrder,
      params.status,
    ])
    expect(options?.placeholderData?.('prev')).toBe('prev')

    await options?.queryFn?.()
    expect(getCustomerListMock).toHaveBeenCalledWith({
      offset: 10,
      query: 'foo',
      sortKey: 'userId',
      sortOrder: 'asc',
      status: 'suspended',
    })

    expect(result.customerList).toBe(queryResult.data)
    expect(result.isLoading).toBe(queryResult.isFetching)
  })

  it('resets page to 1 when query or sort parameters change', async () => {
    const params = {
      offset: ref(0),
      query: ref(''),
      sortKey: ref('userId'),
      sortOrder: ref<SortOrder>('asc' as SortOrder),
      status: ref<string | undefined>(undefined),
    }
    const page = ref(5)
    useQueryMock.mockReturnValue({ data: ref(), isFetching: ref(false) })

    const useCustomerListApi = await loadComposable()
    useCustomerListApi(params, page)

    params.query.value = 'new'
    await nextTick()
    expect(page.value).toBe(1)

    page.value = 4
    params.sortKey.value = 'nickname'
    await nextTick()
    expect(page.value).toBe(1)

    page.value = 3
    params.sortOrder.value = SortOrder.Desc
    await nextTick()
    expect(page.value).toBe(1)

    page.value = 2
    params.status.value = 'suspended'
    await nextTick()
    expect(page.value).toBe(1)
  })
})
