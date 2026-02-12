import { describe, beforeEach, it, expect, vi } from 'vitest'
import { computed, ref, type ComputedRef } from 'vue'

import { routeNames, routePaths } from '@/router/routes'
import message from '@/enum/message.json'

const useRouteMock = vi.hoisted(() => vi.fn())
const useRouterMock = vi.hoisted(() => vi.fn())
const useProductsDetailApiMock = vi.hoisted(() => vi.fn())
const useProductDeleteApiMock = vi.hoisted(() => vi.fn())
const elMessageSuccessMock = vi.hoisted(() => vi.fn())
const elMessageErrorMock = vi.hoisted(() => vi.fn())

vi.mock('vue-router', () => ({
  useRoute: useRouteMock,
  useRouter: useRouterMock,
}))

vi.mock('@/hooks/useProductsDetailApi', () => ({
  useProductsDetailApi: useProductsDetailApiMock,
}))

vi.mock('@/hooks/useProductDeleteApi', () => ({
  useProductDeleteApi: useProductDeleteApiMock,
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: elMessageSuccessMock,
    error: elMessageErrorMock,
  },
}))

describe('useProductsDetailPage', () => {
  beforeEach(() => {
    vi.resetModules()
    useRouteMock.mockReset()
    useRouterMock.mockReset()
    useProductsDetailApiMock.mockReset()
    useProductDeleteApiMock.mockReset()
    elMessageSuccessMock.mockReset()
    elMessageErrorMock.mockReset()
  })

  const loadComposable = async () => {
    const module = await import('@/views/products/detail/useProductsDetailPage')
    return module.useProductsDetailPage
  }

  it('exposes product detail derived state and passes janCode to API hooks', async () => {
    const pushMock = vi.fn()
    useRouteMock.mockReturnValue({
      params: { id: 'JAN-001' },
    })
    useRouterMock.mockReturnValue({ push: pushMock })

    const productDetailRef = ref({
      productId: 101,
      productImage: 'https://cdn/image.png',
      productName: '特製フライドポテト',
      maker: 'ACME',
      janCode: 'JAN-001',
      description: 'crispy fries',
    })

    useProductsDetailApiMock.mockReturnValue({
      productDetail: productDetailRef,
      isFetching: computed(() => false),
    })
    useProductDeleteApiMock.mockReturnValue({
      deleteProductMutateAsync: vi.fn(),
      isDeleteLoading: computed(() => false),
    })

    const useProductsDetailPage = await loadComposable()
    const composable = useProductsDetailPage()

    expect(useProductsDetailApiMock).toHaveBeenCalledWith(expect.any(Object))
    expect(composable.productDetail).toBe(productDetailRef)
    expect((composable.imageUrl as ComputedRef<string>).value).toBe('https://cdn/image.png')
    expect(
      (composable.summary as ComputedRef<Array<{ label: string; text: string }>>).value,
    ).toEqual([
      { label: '商品名', text: '特製フライドポテト' },
      { label: 'メーカー', text: 'ACME' },
      { label: 'JANコード', text: 'JAN-001' },
    ])
    expect(
      (composable.detail as ComputedRef<Array<{ label: string; text: string }>>).value,
    ).toEqual([{ label: '商品説明', text: 'crispy fries' }])
    expect((composable.isFetching as ComputedRef<boolean>).value).toBe(false)
    expect((composable.isDeleteLoading as ComputedRef<boolean>).value).toBe(false)

    composable.updateHandle!()
    expect(pushMock).toHaveBeenCalledWith({
      name: routeNames.products.registration,
      params: { id: 'JAN-001' },
    })
  })

  it('handles delete success by showing message and routing to product list', async () => {
    const pushMock = vi.fn()
    useRouteMock.mockReturnValue({ params: { id: 'JAN-002' } })
    useRouterMock.mockReturnValue({ push: pushMock })

    const deleteProductMutateAsyncMock = vi.fn().mockResolvedValue({ resultCode: 1 })
    useProductsDetailApiMock.mockReturnValue({
      productDetail: ref({
        productId: 55,
        productImage: '',
        productName: '',
        maker: '',
        janCode: 'JAN-002',
        description: '',
      }),
      isFetching: ref(false),
    })
    useProductDeleteApiMock.mockReturnValue({
      deleteProductMutateAsync: deleteProductMutateAsyncMock,
      isDeleteLoading: ref(false),
    })

    const useProductsDetailPage = await loadComposable()
    const { deleteHandle } = useProductsDetailPage()

    await deleteHandle!()

    expect(deleteProductMutateAsyncMock).toHaveBeenCalledWith(55)
    expect(elMessageSuccessMock).toHaveBeenCalledWith(message.product.deleteSuccess)
    expect(pushMock).toHaveBeenCalledWith(routePaths.products.root)
    expect(elMessageErrorMock).not.toHaveBeenCalled()
  })

  it('suppresses navigation when delete API returns failure', async () => {
    const pushMock = vi.fn()
    useRouteMock.mockReturnValue({ params: { id: 'JAN-003' } })
    useRouterMock.mockReturnValue({ push: pushMock })

    const deleteProductMutateAsyncMock = vi.fn().mockRejectedValue(new Error('delete failed'))

    useProductsDetailApiMock.mockReturnValue({
      productDetail: ref({
        productId: 998,
        productImage: '',
        productName: '',
        maker: '',
        janCode: 'JAN-003',
        description: '',
      }),
      isFetching: ref(false),
    })
    useProductDeleteApiMock.mockReturnValue({
      deleteProductMutateAsync: deleteProductMutateAsyncMock,
      isDeleteLoading: ref(true),
    })

    const useProductsDetailPage = await loadComposable()
    const { deleteHandle } = useProductsDetailPage()

    await expect(deleteHandle!()).rejects.toThrow('delete failed')

    expect(deleteProductMutateAsyncMock).toHaveBeenCalledWith(998)
    expect(elMessageSuccessMock).not.toHaveBeenCalled()
    expect(elMessageErrorMock).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })
})
