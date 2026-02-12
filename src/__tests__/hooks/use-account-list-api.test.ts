import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { SortOrder } from '@/enum'

const useQueryMock = vi.hoisted(() => vi.fn())
const getAccountListMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/accounts', () => ({
  getAccountList: getAccountListMock,
}))

describe('useAccountListApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getAccountListMock.mockReset()
  })

  it('configures useQuery with reactive params and exposes list bindings', async () => {
    const accountListRef = ref({ data: { accounts: [], total: 0 } })
    type MockedQueryOptions = {
      queryKey: unknown[]
      queryFn: () => Promise<unknown>
      placeholderData: (prev: unknown) => unknown
    }
    let capturedOptions: Record<string, unknown> | null = null

    useQueryMock.mockImplementation((options: Record<string, unknown>) => {
      capturedOptions = options
      return { data: accountListRef, isFetching: false }
    })

    const offset = ref(0)
    const query = ref('テスト')
    const sortKey = ref('name')
    const sortOrder = ref<SortOrder>(SortOrder.Asc)
    const page = ref(2)

    const { useAccountListApi } = await import('@/hooks/useAccountListApi')
    const { accountList, isLoading } = useAccountListApi(
      { offset, query, sortKey, sortOrder },
      page,
    )

    expect(accountList).toBe(accountListRef)
    expect(isLoading).toBe(false)
    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const options = capturedOptions as MockedQueryOptions | null
    expect(options?.queryKey).toEqual(['accountList', offset, query, sortKey, sortOrder])
    expect(options?.placeholderData?.('prev')).toBe('prev')

    getAccountListMock.mockResolvedValueOnce({ data: [] })
    await options?.queryFn()
    expect(getAccountListMock).toHaveBeenCalledWith({
      offset: 0,
      query: 'テスト',
      sortKey: 'name',
      sortOrder: SortOrder.Asc,
    })
  })

  it('resets page to 1 when query params change', async () => {
    useQueryMock.mockReturnValue({ data: ref(), isFetching: false })
    const offset = ref(10)
    const query = ref('')
    const sortKey = ref('')
    const sortOrder = ref<SortOrder>(SortOrder.Asc)
    const page = ref(5)

    const { useAccountListApi } = await import('@/hooks/useAccountListApi')
    useAccountListApi({ offset, query, sortKey, sortOrder }, page)

    query.value = 'keyword'
    await Promise.resolve()
    expect(page.value).toBe(1)

    sortKey.value = 'email'
    await Promise.resolve()
    expect(page.value).toBe(1)

    sortOrder.value = SortOrder.Desc
    await Promise.resolve()
    expect(page.value).toBe(1)
  })
})
