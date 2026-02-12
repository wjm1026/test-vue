import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref, type PropType } from 'vue'

import ProductsRegistrationPage from '@/views/products/registration/ProductsRegistrationPage.vue'

const useProductsRegistrationPageMock = vi.hoisted(() => vi.fn())
vi.mock('@/views/products/registration/useProductsRegistrationPage', () => ({
  useProductsRegistrationPage: useProductsRegistrationPageMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: { title: { type: String, default: '' } },
  setup(props, { slots }) {
    return () => h('div', { 'data-testid': 'layout', 'data-title': props.title }, slots.default?.())
  },
})

const ProductsFormStub = defineComponent({
  name: 'ProductsForm',
  emits: ['successSubmit'],
  setup(_, { emit, attrs }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': 'submit',
          ...attrs,
          onClick: () =>
            emit('successSubmit', {
              productName: 'P',
              maker: 'M',
            }),
        },
        'submit',
      )
  },
})

const ProductsDialogStub = defineComponent({
  name: 'ProductsDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    product: { type: Object as PropType<{ productName?: string }>, default: () => ({}) },
  },
  setup(props, { attrs }) {
    return () =>
      h('div', { 'data-testid': 'dialog', 'data-open': props.modelValue ? 'open' : 'closed' }, [
        h('p', { 'data-testid': 'dialog-name' }, props.product?.productName ?? ''),
        h(
          'button',
          {
            type: 'button',
            'data-testid': 'close',
            onClick: () => (attrs.onCloseDialog as (() => void) | undefined)?.(),
          },
          'close',
        ),
      ])
  },
})

function renderPage() {
  return render(ProductsRegistrationPage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        ProductsForm: ProductsFormStub,
        ProductsDialog: ProductsDialogStub,
      },
    },
  })
}

describe('ProductsRegistrationPage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useProductsRegistrationPageMock.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('opens dialog with product after successful submit and closes on action', async () => {
    const registrationVisible = ref(false)
    const product = ref({ productName: '', maker: '' })
    const successSubmit = vi.fn((p) => {
      product.value = p
      registrationVisible.value = true
    })

    useProductsRegistrationPageMock.mockReturnValue({ registrationVisible, product, successSubmit })

    const { getByTestId, findByTestId, queryByTestId } = renderPage()

    await fireEvent.click(getByTestId('submit'))
    expect(successSubmit).toHaveBeenCalledTimes(1)
    const dialog = await findByTestId('dialog')
    expect(dialog.getAttribute('data-open')).toBe('open')
    expect((await findByTestId('dialog-name')).textContent).toBe('P')

    await fireEvent.click(getByTestId('close'))
    await waitFor(() => {
      expect(queryByTestId('dialog')).toBeNull()
    })
  })

  it('renders LayoutMain with correct title', () => {
    // Purpose: verify page title is displayed correctly.
    const registrationVisible = ref(false)
    const product = ref({ productName: '', maker: '' })
    const successSubmit = vi.fn()

    useProductsRegistrationPageMock.mockReturnValue({ registrationVisible, product, successSubmit })

    const { getByTestId } = renderPage()
    expect(getByTestId('layout').getAttribute('data-title')).toBe('商品情報個別登録')
  })

  it('does not render dialog when registrationVisible is false', () => {
    // Purpose: ensure dialog is conditionally rendered based on visibility state.
    const registrationVisible = ref(false)
    const product = ref({ productName: '', maker: '' })
    const successSubmit = vi.fn()

    useProductsRegistrationPageMock.mockReturnValue({ registrationVisible, product, successSubmit })

    const { queryByTestId } = renderPage()
    expect(queryByTestId('dialog')).toBeNull()
  })

  it('renders dialog with product data when registrationVisible is true', () => {
    // Purpose: verify dialog displays product information when visible.
    const registrationVisible = ref(true)
    const product = ref({ productName: 'Test Product', maker: 'Test Maker' })
    const successSubmit = vi.fn()

    useProductsRegistrationPageMock.mockReturnValue({ registrationVisible, product, successSubmit })

    const { getByTestId } = renderPage()
    const dialog = getByTestId('dialog')
    expect(dialog.getAttribute('data-open')).toBe('open')
    expect(getByTestId('dialog-name').textContent).toBe('Test Product')
  })

  it('handles multiple form submissions with different product data', async () => {
    // Purpose: verify form can be submitted multiple times with different data.
    const registrationVisible = ref(false)
    const product = ref({ productName: '', maker: '' })
    const successSubmit = vi.fn((p) => {
      product.value = p
      registrationVisible.value = true
    })

    useProductsRegistrationPageMock.mockReturnValue({ registrationVisible, product, successSubmit })

    const { getByTestId, findByTestId } = renderPage()

    await fireEvent.click(getByTestId('submit'))
    expect(successSubmit).toHaveBeenCalledTimes(1)
    expect((await findByTestId('dialog-name')).textContent).toBe('P')

    registrationVisible.value = false
    await fireEvent.click(getByTestId('submit'))
    expect(successSubmit).toHaveBeenCalledTimes(2)
  })

  it('renders ProductsForm component', () => {
    // Purpose: verify ProductsForm is rendered and can emit events.
    const registrationVisible = ref(false)
    const product = ref({ productName: '', maker: '' })
    const successSubmit = vi.fn()

    useProductsRegistrationPageMock.mockReturnValue({ registrationVisible, product, successSubmit })

    const { getByTestId } = renderPage()
    expect(getByTestId('submit')).toBeInTheDocument()
  })
})
