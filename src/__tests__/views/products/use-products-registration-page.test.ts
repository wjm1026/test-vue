import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ProductType } from '@/api/types/products'

const loadComposable = async () => {
  const module = await import('@/views/products/registration/useProductsRegistrationPage')
  return module.useProductsRegistrationPage()
}

describe('useProductsRegistrationPage', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('provides default registration visibility and empty product fields', async () => {
    // Ensure the initial state aligns with the registration dialog contract.
    const { registrationVisible, product } = await loadComposable()

    expect(registrationVisible.value).toBe(false)
    expect(product.value).toEqual({
      productImageUrl: '',
      productName: '',
      maker: '',
    })
  })

  it('successSubmit stores provided product data and opens the modal', async () => {
    // Confirm submissions replace the product payload and reveal the modal each time.
    const { registrationVisible, product, successSubmit } = await loadComposable()
    const firstProduct: ProductType = {
      productImageUrl: 'https://cdn/img-001.png',
      productName: '金のカレー',
      maker: 'ACME',
    }
    const secondProduct: ProductType = {
      productImageUrl: 'https://cdn/img-002.png',
      productName: '銀のシチュー',
      maker: 'Globex',
    }

    successSubmit(firstProduct)
    expect(product.value).toStrictEqual(firstProduct)
    expect(registrationVisible.value).toBe(true)

    successSubmit(secondProduct)
    expect(product.value).toStrictEqual(secondProduct)
    expect(registrationVisible.value).toBe(true)
  })

  it('successSubmit handles product with empty strings', async () => {
    // Purpose: verify empty product data is handled correctly.
    const { registrationVisible, product, successSubmit } = await loadComposable()
    const emptyProduct: ProductType = {
      productImageUrl: '',
      productName: '',
      maker: '',
    }

    successSubmit(emptyProduct)
    expect(product.value).toStrictEqual(emptyProduct)
    expect(registrationVisible.value).toBe(true)
  })

  it('product ref can be manually updated', async () => {
    // Purpose: ensure product ref is reactive and can be modified.
    const { product } = await loadComposable()
    const newProduct: ProductType = {
      productImageUrl: 'https://example.com/image.png',
      productName: 'Test Product',
      maker: 'Test Maker',
    }

    product.value = newProduct
    expect(product.value).toStrictEqual(newProduct)
  })

  it('registrationVisible can be toggled manually', async () => {
    // Purpose: verify registrationVisible ref can be controlled.
    const { registrationVisible } = await loadComposable()
    expect(registrationVisible.value).toBe(false)

    registrationVisible.value = true
    expect(registrationVisible.value).toBe(true)

    registrationVisible.value = false
    expect(registrationVisible.value).toBe(false)
  })
})
