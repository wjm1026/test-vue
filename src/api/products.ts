import { createApiRequest } from './request'
import type { ProductCategoryResponse, ProductDetailResponse, ProductForm } from './types/products'

import { createListMockHandler } from '@/mocks/processors/mocksHandler'
import type {
  ProductListResponse,
  ProductResponse,
  Product,
  ProductDeleteResponse,
} from '@/api/types/products'
import { SortOrder, pageSize } from '@/enum'
import productList from '@/mocks/data/product/productList.json'
import productDetail from '@/mocks/data/product/productDetail.json'
import product from '@/mocks/data/product/product.json'
import productDelete from '@/mocks/data/product/productDelete.json'
import productCategory from '@/mocks/data/product/productCategory.json'
import { toCamelCaseKeys } from '@/util/camel-case'
import { convertToFormData } from '@/util/form-data-helper'

const requestProductList = createApiRequest<ProductListResponse>(
  toCamelCaseKeys(productList),
  createListMockHandler<Product, ProductListResponse, 'total', 'products'>(
    ['productName', 'maker', 'janCode'],
    'total',
    'products',
  ),
)

const requestProductDetail = createApiRequest<ProductDetailResponse>(toCamelCaseKeys(productDetail))

const requestProduct = createApiRequest<ProductResponse>(toCamelCaseKeys(product))

const requestProductDelete = createApiRequest<ProductDeleteResponse>(toCamelCaseKeys(productDelete))

const requestProductCategory = createApiRequest<ProductCategoryResponse>(
  toCamelCaseKeys(productCategory),
)

export const getProducts = (params?: {
  query: string
  offset: number
  limit?: number
  sortKey: string
  sortOrder: SortOrder
}) =>
  requestProductList({
    url: '/product-list',
    method: 'GET',
    params: {
      limit: pageSize,
      ...params,
    },
  })

export const getProductDetail = (params: { janCode: string }) =>
  requestProductDetail({
    url: '/product-detail',
    method: 'GET',
    params,
  })

export const addProduct = (form: ProductForm) => {
  const data = convertToFormData(form)
  return requestProduct({
    url: '/product',
    method: 'POST',
    data, // FormData
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getProductCategory = () =>
  requestProductCategory({
    url: '/product-category',
    method: 'GET',
  })

export const deleteProduct = (productId: number) =>
  requestProductDelete({
    url: `/product/${productId}`,
    method: 'DELETE',
  })
