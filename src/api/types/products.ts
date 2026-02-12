import { ProductUsedFlag } from '@/enum' 

export interface Product {
  productImageUrl: string
  productName: string
  maker: string
  janCode: string
  createdAt: string
}

export type ProductListResponse = {
  total: number
  products: Product[]
}

export interface ProductForm {
  productId?: number
  productName: string
  maker: string
  janCode: string
  productCategory: number | null
  productImage?: File
  description?: string
  other?: string
}

export interface ProductType {
  productImageUrl: string
  productName: string
  maker: string
}

export type ProductResponse = ProductType

export interface ProductsDetailType {
  productId: number
  productImage: string
  productName: string
  maker: string
  janCode: string
  categoryName: string
  description: string
  capacity: string
  other: string
  usedFlag: ProductUsedFlag
}

export type ProductDetailResponse = ProductsDetailType

export interface CategoryType {
  categoryId: number
  categoryName: string
}

export type ProductCategoryResponse = {
  categories: CategoryType[]
}

export type ProductDeleteResponse = {
  resultCode: number
}
