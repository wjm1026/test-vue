import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { ref, type Ref } from 'vue'

import type { ProductsDetailType } from '@/api/types/products'

const getProductDetailMock = vi.fn()

vi.mock('@/api/products', () => ({
  getProductDetail: getProductDetailMock,
}))

type QueryState = {
  data: Ref<unknown>
  run: () => Promise<void>
}

const queryState: { current: QueryState | null } = { current: null }

vi.mock('@tanstack/vue-query', async () => {
  const { ref } = await import('vue')

  return {
    useQuery: vi.fn((options: { queryFn: () => Promise<unknown> }) => {
      const data = ref<unknown>()
      const run = async () => {
        data.value = await options.queryFn()
      }
      queryState.current = { data, run }
      run()
      return { data }
    }),
  }
})

describe('useProductsDetailApi', () => {
  beforeEach(() => {
    getProductDetailMock.mockReset()
    queryState.current = null
  })

  it('requests product detail with provided janCode and exposes reactive data', async () => {
    const response = {
      code: 200,
      data: { productName: 'Alpha Drink', janCode: '123' },
    }
    getProductDetailMock.mockResolvedValueOnce(response)

    const { useProductsDetailApi } = await import('@/hooks/useProductsDetailApi')
    const { productDetail } = useProductsDetailApi(ref('123')) as {
      productDetail: Ref<ProductsDetailType>
    }

    await flushPromises()

    expect(getProductDetailMock).toHaveBeenCalledTimes(1)
    expect(getProductDetailMock).toHaveBeenCalledWith({ janCode: '123' })
    expect(productDetail.value).toEqual(response)
  })
})
