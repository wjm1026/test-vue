import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref, type Ref } from 'vue'

type UseProductsForm = typeof import('@/components/view/products/useProductsForm')

// Router mocks
const goMock = vi.fn()
vi.mock('vue-router', () => ({
  useRoute: () => ({ params: {} }),
  useRouter: () => ({ go: goMock }),
}))

// Dependent hooks/util mocks
let productDetailRef: Ref<unknown>
const refetchDetailMock = vi.fn()
const submitProductMock = vi.fn()
const productCategoryRef: Ref<unknown> = ref(undefined)

vi.mock('@/hooks/useProductsDetailApi', () => ({
  useProductsDetailApi: () => ({
    productDetail: productDetailRef,
    isFetching: ref(false),
    refetchDetail: refetchDetailMock,
  }),
}))

vi.mock('@/hooks/useProductApi', () => ({
  useProductApi: () => ({
    submitProduct: submitProductMock,
    isPending: ref(false),
  }),
}))

vi.mock('@/hooks/useProductCategoryApi', () => ({
  useProductCategoryApi: () => ({
    productCategory: productCategoryRef,
    isFetching: ref(false),
  }),
}))

const urlToFileMock = vi.fn()
vi.mock('@/util/form-data-helper', () => ({
  urlToFile: (...args: unknown[]) => urlToFileMock(...args),
}))

async function createComposable(options?: {
  routeId?: string
  productDetailData?: unknown
  productCategoryData?: unknown
}) {
  vi.resetModules()
  submitProductMock.mockReset()
  refetchDetailMock.mockReset()
  goMock.mockReset()
  urlToFileMock.mockReset()
  productDetailRef = ref(options?.productDetailData ?? undefined)
  productCategoryRef.value = options?.productCategoryData

  // Re-mock route per test for routeId injection
  vi.doMock('vue-router', () => ({
    useRoute: () => ({ params: options?.routeId ? { id: options.routeId } : {} }),
    useRouter: () => ({ go: goMock }),
  }))

  const module = (await import(
    '@/components/view/products/useProductsForm'
  )) as unknown as UseProductsForm
  const emit = vi.fn()
  const composable = module.useProductsForm(emit)
  return { composable, emit }
}

describe('useProductsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('initializes state, rules, and disabled flag', async () => {
    const { composable } = await createComposable()
    expect(composable.form.productName).toBe('')
    expect(composable.form.maker).toBe('')
    expect(composable.form.janCode).toBe('')
    expect(composable.form.productCategory).toBeNull()
    expect(composable.productImageUrl.value).toBe('')
    expect(composable.disabled.value).toBe(true)

    const rules = composable.rules as unknown as Record<string, unknown>
    expect(typeof rules).toBe('object')
  }, 10000)

  it('disabled is false when required fields are filled', async () => {
    const { composable } = await createComposable()
    composable.form.productName = 'Name'
    composable.form.maker = 'Maker'
    composable.form.janCode = '1234567890123'
    composable.form.productCategory = 1 as never
    expect(composable.disabled.value).toBe(false)
  })

  it('handleChange assigns image file and preview URL', async () => {
    const { composable } = await createComposable()
    const file = new File(['data'], 'img.png', { type: 'image/png' })

    // Stub FileReader
    const readAsDataURLSpy = vi.fn(function (this: FileReader) {
      // simulate onload
      const e = {
        target: { result: 'data:image/png;base64,AAA' },
      } as unknown as ProgressEvent<FileReader>
      setTimeout(() => this.onload?.(e), 0)
    })
    vi.stubGlobal(
      'FileReader',
      class {
        onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null
        readAsDataURL = readAsDataURLSpy as unknown as (file: Blob) => void
      },
    )

    await composable.handleChange({ raw: file } as never)

    expect(composable.form.productImage).toBe(file)
    await new Promise((r) => setTimeout(r, 0))
    expect(composable.productImageUrl.value).toBe('data:image/png;base64,AAA')
  })

  it('handleRemove clears image file and preview', async () => {
    const { composable } = await createComposable()
    composable.form.productImage = new File(['x'], 'a.png', { type: 'image/png' })
    composable.productImageUrl.value = 'data:image/png;base64,X'
    composable.handleRemove()
    expect(composable.form.productImage).toBeUndefined()
    expect(composable.productImageUrl.value).toBe('')
  })

  it('watch hydrates form and image when detail and category exist', async () => {
    urlToFileMock.mockResolvedValue(new File(['d'], 'img.jpg', { type: 'image/jpeg' }))
    const { composable } = await createComposable({
      routeId: '1111111111111',
      productDetailData: {
        productId: 99,
        productName: 'Loaded',
        maker: 'Maker',
        janCode: '1111111111111',
        description: 'Desc',
        other: 'Other info',
        productImage: 'https://cdn/img.jpg',
        categoryName: 'Beverage',
      },
      productCategoryData: {
        categories: [
          { categoryId: 1, categoryName: 'Food' },
          { categoryId: 2, categoryName: 'Beverage' },
        ],
      },
    })

    // Wait for watch to trigger
    await new Promise((r) => setTimeout(r, 0))

    expect(composable.form.productName).toBe('Loaded')
    expect(composable.form.maker).toBe('Maker')
    expect(composable.form.janCode).toBe('1111111111111')
    expect(composable.form.description).toBe('Desc')
    expect(composable.form.other).toBe('Other info')
    expect(composable.productImageUrl.value).toBe('https://cdn/img.jpg')
    expect(composable.form.productCategory).toBe(2)
    // Ensure image conversion was attempted for preview source
    expect(urlToFileMock).toHaveBeenCalledWith('https://cdn/img.jpg')
  })

  it('formSubmit validates and submits new product then emits', async () => {
    const { composable, emit } = await createComposable()
    composable.productsFormRef.value = {
      validate: vi.fn((cb: (valid: boolean) => void) => cb(true)),
    } as never

    composable.form.productName = 'Name'
    composable.form.maker = 'Maker'
    composable.form.janCode = '222'
    composable.form.productCategory = 1 as never

    submitProductMock.mockResolvedValue({ id: 1 })
    await composable.formSubmit()

    expect(submitProductMock).toHaveBeenCalledTimes(1)
    expect(submitProductMock).toHaveBeenCalledWith({
      product_name: 'Name',
      maker: 'Maker',
      jan_code: '222',
      product_category: 1,
      product_image: undefined,
      description: '',
      other: '',
    })
    expect(emit).toHaveBeenCalledWith('successSubmit', { id: 1 })
  })

  it('formSubmit includes productId when editing', async () => {
    const { composable } = await createComposable({
      routeId: '10',
      productDetailData: {
        productId: 10,
        productName: 'Test',
        maker: 'TestMaker',
        janCode: '123',
        categoryName: 'Food',
      },
      productCategoryData: {
        categories: [{ categoryId: 1, categoryName: 'Food' }],
      },
    })
    composable.productsFormRef.value = {
      validate: vi.fn((cb: (valid: boolean) => void) => cb(true)),
    } as never

    // Wait for watch to hydrate
    await new Promise((r) => setTimeout(r, 0))

    submitProductMock.mockResolvedValue({})
    await composable.formSubmit()
    expect(submitProductMock).toHaveBeenCalledWith({
      product_name: 'Test',
      maker: 'TestMaker',
      jan_code: '123',
      product_category: 1,
      product_image: undefined,
      description: '',
      other: '',
      product_id: 10,
    })
  })

  it('formSubmit returns early if form ref missing or invalid', async () => {
    const { composable } = await createComposable()
    composable.productsFormRef.value = undefined as never
    await composable.formSubmit()
    expect(submitProductMock).not.toHaveBeenCalled()

    composable.productsFormRef.value = {
      validate: vi.fn((cb: (valid: boolean) => void) => cb(false)),
    } as never
    await composable.formSubmit()
    expect(submitProductMock).not.toHaveBeenCalled()
  })

  it('handleCancel navigates back', async () => {
    const { composable } = await createComposable()
    composable.handleCancel()
    expect(goMock).toHaveBeenCalledWith(-1)
  })
})
