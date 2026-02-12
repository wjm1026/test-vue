import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { SortOrder } from '@/enum'

const useQueryMock = vi.hoisted(() => vi.fn())
const getProductsMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/products', () => ({
  getProducts: getProductsMock,
}))

describe('useProductListApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getProductsMock.mockReset()
  })

  it('configures useQuery with reactive params and forwards queryFn to getProducts', async () => {
    const dataRef = ref({ code: 200 })
    let capturedOptions: {
      queryKey: unknown[]
      queryFn: () => Promise<unknown>
      placeholderData: (prev: unknown) => unknown
    } | null = null

    useQueryMock.mockImplementation((options) => {
      capturedOptions = options
      return {
        data: dataRef,
        isFetching: false,
      }
    })

    const offset = ref(10)
    const query = ref('milk')
    const sortKey = ref('product_name')
    const sortOrder = ref(SortOrder.Asc)
    const page = ref(2)
    const response = { data: { products: [] } }
    getProductsMock.mockResolvedValue(response)

    const { useProductListApi } = await import('@/hooks/useProductListApi')
    const { productList, isLoading } = useProductListApi(
      { offset, query, sortKey, sortOrder },
      page,
    )

    expect(productList).toBe(dataRef)
    expect(isLoading).toBe(false)
    expect(useQueryMock).toHaveBeenCalledTimes(1)
    expect(capturedOptions!.queryKey).toEqual(['productList', offset, query, sortKey, sortOrder])
    expect(capturedOptions!.placeholderData?.('prev')).toBe('prev')

    await capturedOptions!.queryFn()
    expect(getProductsMock).toHaveBeenCalledTimes(1)
    expect(getProductsMock).toHaveBeenCalledWith({
      offset: 10,
      query: 'milk',
      sortKey: 'product_name',
      sortOrder: SortOrder.Asc,
    })
  })

  it('resets page to 1 when query or sorting parameters change', async () => {
    useQueryMock.mockReturnValue({
      data: ref(null),
      isFetching: true,
    })

    const offset = ref(0)
    const query = ref('')
    const sortKey = ref('product_name')
    const sortOrder = ref(SortOrder.Asc)
    const page = ref(5)

    const { useProductListApi } = await import('@/hooks/useProductListApi')
    useProductListApi({ offset, query, sortKey, sortOrder }, page)

    page.value = 4
    query.value = 'new'
    await nextTick()
    expect(page.value).toBe(1)

    page.value = 3
    sortKey.value = 'maker'
    await nextTick()
    expect(page.value).toBe(1)

    page.value = 2
    sortOrder.value = SortOrder.Desc
    await nextTick()
    expect(page.value).toBe(1)
  })
})
