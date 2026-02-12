import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref, type Ref } from 'vue'

const useQueryMock = vi.hoisted(() => vi.fn())
const getProductCategoryMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/products', () => ({
  getProductCategory: getProductCategoryMock,
}))

describe('useProductCategoryApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getProductCategoryMock.mockReset()
  })

  it('subscribes to product categories via useQuery with placeholder passthrough', async () => {
    const dataRef = ref('initial-category') as Ref<unknown>
    useQueryMock.mockReturnValue({
      data: dataRef,
    })

    const { useProductCategoryApi } = await import('@/hooks/useProductCategoryApi')
    const { productCategory } = useProductCategoryApi()

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const options = useQueryMock.mock.calls[0]?.[0]
    expect(options).toMatchObject({
      queryKey: ['category'],
      queryFn: getProductCategoryMock,
    })
    expect(options?.placeholderData).toBeTypeOf('function')
    const previous = Symbol('previous')
    expect(options?.placeholderData?.(previous)).toBe(previous)

    expect(productCategory).toBe(dataRef)
  })
})
