import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref, type Ref } from 'vue'

type UseProductsPageModule = typeof import('@/views/products/useProductsPage')

const pushMock = vi.fn()
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({ push: pushMock }),
  }
})

let productListRef: Ref<unknown>
const isLoadingRef = ref(false)
vi.mock('@/hooks/useProductListApi', () => ({
  useProductListApi: () => ({ productList: productListRef, isLoading: isLoadingRef }),
}))

async function createComposable(listData?: unknown) {
  vi.resetModules()
  pushMock.mockReset()
  productListRef = ref(listData)
  const module = (await import(
    '@/views/products/useProductsPage'
  )) as unknown as UseProductsPageModule
  return module.useProductsPage()
}

describe('useProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('initializes paging, sorting, and exposes product list and loading', async () => {
    const composable = await createComposable({ products: [], total: 0 })
    expect(composable.page.value).toBeGreaterThan(0)
    expect(composable.sortField.value).toBe('')
    expect(composable.sortOrder.value).toBeTypeOf('string')
    expect(['asc', 'desc']).toContain(composable.sortOrder.value)
    expect(composable.productList.value).toEqual({ products: [], total: 0 })
    expect(composable.isLoading.value).toBe(false)
  })

  it('pageChange updates page value', async () => {
    const composable = await createComposable()
    composable.pageChange(5)
    expect(composable.page.value).toBe(5)
  })

  it('productAdd navigates to product registration route', async () => {
    const composable = await createComposable()
    await composable.productAdd()
    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({ name: expect.any(String) })
  })
})
