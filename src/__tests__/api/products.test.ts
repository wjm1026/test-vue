import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { SortOrder, pageSize } from '@/enum'
import type { ProductForm } from '@/api/types/products'

const listRequestSpy = vi.fn()
const detailRequestSpy = vi.fn()
const productRequestSpy = vi.fn()
const deleteRequestSpy = vi.fn()
const categoryRequestSpy = vi.fn()

const createApiRequestMock: Mock = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('Unexpected call order')
  }),
)

const toCamelCaseKeysMock = vi.hoisted(() => vi.fn((value) => ({ __converted: value })))

const createListMockHandlerMock = vi.hoisted(() => vi.fn(() => Symbol('list-handler')))

const convertToFormDataMock = vi.hoisted(() => vi.fn(() => Symbol('form-data')))

vi.mock('@/api/request', () => ({
  createApiRequest: createApiRequestMock,
}))

vi.mock('@/util/camel-case', () => ({
  toCamelCaseKeys: toCamelCaseKeysMock,
}))

vi.mock('@/mocks/processors/mocksHandler', () => ({
  createListMockHandler: createListMockHandlerMock,
}))

vi.mock('@/util/form-data-helper', () => ({
  convertToFormData: convertToFormDataMock,
}))

describe('api/products', () => {
  beforeEach(() => {
    vi.resetModules()
    listRequestSpy.mockReset().mockResolvedValue('list-response')
    detailRequestSpy.mockReset().mockResolvedValue('detail-response')
    productRequestSpy.mockReset().mockResolvedValue('product-response')
    deleteRequestSpy.mockReset().mockResolvedValue('delete-response')
    categoryRequestSpy.mockReset().mockResolvedValue('category-response')
    createApiRequestMock.mockReset()
    createListMockHandlerMock.mockClear()
    toCamelCaseKeysMock.mockClear()
    convertToFormDataMock.mockReset().mockReturnValue(Symbol('converted-form-data'))

    createApiRequestMock
      .mockImplementationOnce(() => listRequestSpy)
      .mockImplementationOnce(() => detailRequestSpy)
      .mockImplementationOnce(() => productRequestSpy)
      .mockImplementationOnce(() => deleteRequestSpy)
      .mockImplementationOnce(() => categoryRequestSpy)
  })

  it('initializes product API requests with camelized fixtures and list handler', async () => {
    const module = await import('@/api/products')

    const productListJson = (await import('@/mocks/data/product/productList.json')).default
    const productDetailJson = (await import('@/mocks/data/product/productDetail.json')).default
    const productJson = (await import('@/mocks/data/product/product.json')).default
    const productDeleteJson = (await import('@/mocks/data/product/productDelete.json')).default
    const productCategoryJson = (await import('@/mocks/data/product/productCategory.json')).default

    expect(toCamelCaseKeysMock).toHaveBeenCalledTimes(5)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(productListJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(productDetailJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(productJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(productDeleteJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(productCategoryJson)

    expect(createListMockHandlerMock).toHaveBeenCalledWith(
      ['productName', 'maker', 'janCode'],
      'total',
      'products',
    )
    const listHandler = createListMockHandlerMock.mock.results[0]?.value

    const [listDataArg, listHandlerArg] = createApiRequestMock.mock.calls[0] ?? []
    expect(listDataArg).toEqual({ __converted: productListJson })
    expect(listHandlerArg).toBe(listHandler)

    expect(createApiRequestMock).toHaveBeenNthCalledWith(2, { __converted: productDetailJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(3, { __converted: productJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(4, { __converted: productDeleteJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(5, { __converted: productCategoryJson })

    expect(module.getProducts).toBeTypeOf('function')
    expect(module.getProductDetail).toBeTypeOf('function')
    expect(module.addProduct).toBeTypeOf('function')
    expect(module.getProductCategory).toBeTypeOf('function')
    expect(module.deleteProduct).toBeTypeOf('function')
  })

  it('delegates product requests to their configured request factories', async () => {
    const { getProducts, getProductDetail, addProduct, deleteProduct, getProductCategory } =
      await import('@/api/products')

    const listParams = {
      query: 'milk',
      offset: 30,
      sortKey: 'productName',
      sortOrder: SortOrder.Desc,
    } as const

    const listResult = await getProducts(listParams)
    expect(listResult).toBe('list-response')
    expect(listRequestSpy).toHaveBeenCalledWith({
      url: '/product-list',
      method: 'GET',
      params: {
        limit: pageSize,
        ...listParams,
      },
    })

    const detailResult = await getProductDetail({ janCode: '1234567890123' })
    expect(detailResult).toBe('detail-response')
    expect(detailRequestSpy).toHaveBeenCalledWith({
      url: '/product-detail',
      method: 'GET',
      params: { janCode: '1234567890123' },
    })

    const formPayload = {
      productName: 'Yogurt',
      maker: 'ACME',
      janCode: '0001112223334',
      productCategory: 5,
    } satisfies ProductForm

    const addResult = await addProduct(formPayload)
    expect(addResult).toBe('product-response')
    expect(convertToFormDataMock).toHaveBeenCalledWith(formPayload)
    const formData = convertToFormDataMock.mock.results[0]?.value
    expect(productRequestSpy).toHaveBeenCalledWith({
      url: '/product',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const categoryResult = await getProductCategory()
    expect(categoryResult).toBe('category-response')
    expect(categoryRequestSpy).toHaveBeenCalledWith({
      url: '/product-category',
      method: 'GET',
    })

    const deleteResult = await deleteProduct(99)
    expect(deleteResult).toBe('delete-response')
    expect(deleteRequestSpy).toHaveBeenCalledWith({
      url: '/product/99',
      method: 'DELETE',
    })
  })
})
