import { describe, it, expect, beforeEach, vi } from 'vitest'

const pushMock = vi.fn()

vi.mock('@/router', () => ({
  default: {
    push: pushMock,
  },
}))

describe('useProductsTable', () => {
  beforeEach(() => {
    vi.resetModules()
    pushMock.mockReset()
  })

  it('returns productDetailHandle function', async () => {
    const { useProductsTable } = await import('@/components/view/products/useProductsTable')
    const result = useProductsTable()

    expect(typeof result.productDetailHandle).toBe('function')
  })

  it('navigates to product detail route with provided id', async () => {
    const { routeNames } = await import('@/router/routes')
    const { useProductsTable } = await import('@/components/view/products/useProductsTable')
    const { productDetailHandle } = useProductsTable()

    productDetailHandle('123')

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({
      name: routeNames.products.detail,
      params: { id: '123' },
    })
  })
})
