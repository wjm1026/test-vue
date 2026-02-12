// generated-by: ai-assist v1.0
// type: unit
// description: Type coverage for src/api/types/products.ts.

import { describe, expect, expectTypeOf, it } from 'vitest'

import type {
  CategoryType,
  Product,
  ProductCategoryResponse,
  ProductDeleteResponse,
  ProductDetailResponse,
  ProductForm,
  ProductListResponse,
  ProductResponse,
  ProductType,
  ProductsDetailType,
} from '@/api/types/products'

describe('Product base types', () => {
  it('ensures Product matches the documented shape', () => {
    expectTypeOf<Product>().toMatchTypeOf<{
      productImageUrl: string
      productName: string
      maker: string
      janCode: string
      createdAt: string
    }>()

    const example: Product = {
      productImageUrl: 'https://example.com/product.jpg',
      productName: 'Sample Item',
      maker: 'Needs',
      janCode: '1234567890',
      createdAt: '2024-01-01T00:00:00Z',
    }
    expect(example.productName).toBe('Sample Item')
  })

  it('treats ProductForm optional fields correctly', () => {
    expectTypeOf<ProductForm>().toMatchTypeOf<{
      productId?: number
      productImage?: File
      description?: string
      other?: string
      priorityFlag?: number
      priority?: number
      productCategory: number | null
    }>()

    const minimalForm: ProductForm = {
      productName: 'Minimal',
      maker: 'Needs',
      janCode: '0000',
      productCategory: null,
    }
    expect(minimalForm.productId).toBeUndefined()
    expect(minimalForm.productCategory).toBeNull()
  })

  it('aliases ProductType/ProductResponse and ProductsDetailType/ProductDetailResponse', () => {
    expectTypeOf<ProductResponse>().toMatchTypeOf<ProductType>()
    expectTypeOf<ProductDetailResponse>().toMatchTypeOf<ProductsDetailType>()
    expect(true).toBe(true)
  })
})

describe('Product responses', () => {
  it('structures list response with total + products array', () => {
    expectTypeOf<ProductListResponse>().toMatchTypeOf<{
      total: number
      products: Product[]
    }>()

    const listResponse: ProductListResponse = {
      total: 1,
      products: [
        {
          productImageUrl: 'https://example.com/p.jpg',
          productName: 'Item',
          maker: 'Needs',
          janCode: '1111',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ],
    }
    expect(listResponse.products).toHaveLength(1)
  })

  it('defines category and delete responses with fixed fields', () => {
    expectTypeOf<ProductCategoryResponse>().toMatchTypeOf<{ categories: CategoryType[] }>()
    expectTypeOf<ProductDeleteResponse>().toMatchTypeOf<{ resultCode: number }>()

    const categoriesResponse: ProductCategoryResponse = {
      categories: [{ categoryId: 1, categoryName: 'Skincare' }],
    }
    const deleteResponse: ProductDeleteResponse = { resultCode: 0 }
    expect(categoriesResponse.categories[0].categoryName).toBe('Skincare')
    expect(deleteResponse.resultCode).toBe(0)
  })
})
