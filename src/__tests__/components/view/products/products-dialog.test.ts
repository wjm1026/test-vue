import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/vue'
import { defineComponent, ref, h } from 'vue'

import ProductsDialog from '@/components/view/products/ProductsDialog.vue'
import { routePaths } from '@/router/routes'

const pushMock = vi.hoisted(() => vi.fn())

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

const ElDialogStub = defineComponent({
  name: 'ElDialogStub',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'section',
        {
          'data-testid': 'el-dialog-stub',
          'data-open': String(props.modelValue),
        },
        [
          h(
            'button',
            {
              'data-testid': 'stub-dialog-close',
              type: 'button',
              onClick: () => emit('close'),
            },
            'close',
          ),
          slots.default ? slots.default() : null,
        ],
      )
  },
})

const ElTextStub = defineComponent({
  name: 'ElTextStub',
  setup(_, { slots }) {
    return () => h('span', {}, slots.default ? slots.default() : [])
  },
})

const ElImageStub = defineComponent({
  name: 'ElImageStub',
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return () =>
      h('img', {
        'data-testid': 'dialog-product-image',
        src: props.src,
        alt: '',
      })
  },
})

const BlueButtonStub = defineComponent({
  name: 'BlueButtonStub',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          'data-testid': 'dialog-close-button',
          type: 'button',
          onClick: () => emit('click'),
        },
        props.label,
      )
  },
})

const defaultProduct = {
  productImageUrl: 'https://example.test/product.png',
  productName: 'Alpha Drink',
  maker: 'Needs Connect',
}

function renderProductsDialog(options?: { onClose?: ReturnType<typeof vi.fn> }) {
  const closeSpy = options?.onClose ?? vi.fn()
  const Host = defineComponent({
    components: { ProductsDialog },
    setup() {
      const visible = ref(false)
      const product = ref(defaultProduct)
      const open = () => {
        visible.value = true
      }
      const handleClose = () => {
        visible.value = false
        closeSpy()
      }
      return {
        visible,
        product,
        open,
        handleClose,
      }
    },
    template: `
      <div>
        <ProductsDialog
          v-model="visible"
          :product="product"
          @closeDialog="handleClose"
        />
        <button data-testid="open-dialog" type="button" @click="open">Open</button>
      </div>
    `,
  })

  const utils = render(Host, {
    global: {
      stubs: {
        ElDialog: ElDialogStub,
        ElText: ElTextStub,
        ElImage: ElImageStub,
        BlueButton: BlueButtonStub,
      },
    },
  })

  return { ...utils, closeSpy }
}

describe('ProductsDialog.vue', () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  it('displays product summary when opened', async () => {
    const { getByTestId, getByText } = renderProductsDialog()

    await fireEvent.click(getByTestId('open-dialog'))
    await waitFor(() => expect(getByTestId('el-dialog-stub').dataset.open).toBe('true'))

    expect(getByText('商品が登録されました')).toBeTruthy()
    expect(getByText(defaultProduct.maker)).toBeTruthy()
    expect(getByText(defaultProduct.productName)).toBeTruthy()
    expect(getByTestId('dialog-product-image').getAttribute('src')).toBe(
      defaultProduct.productImageUrl,
    )
  })

  it('emits closeDialog and routes to products root when close button is clicked', async () => {
    const closeSpy = vi.fn()
    const { getByTestId } = renderProductsDialog({ onClose: closeSpy })

    await fireEvent.click(getByTestId('open-dialog'))
    await waitFor(() => expect(getByTestId('el-dialog-stub').dataset.open).toBe('true'))

    await fireEvent.click(getByTestId('dialog-close-button'))

    await waitFor(() => expect(closeSpy).toHaveBeenCalledTimes(1))
    expect(pushMock).toHaveBeenCalledWith(routePaths.products.root)
    await waitFor(() => expect(getByTestId('el-dialog-stub').dataset.open).toBe('false'))
  })

  it('handles ElDialog close event by calling closeDialog handler', async () => {
    const closeSpy = vi.fn()
    const { getByTestId } = renderProductsDialog({ onClose: closeSpy })

    await fireEvent.click(getByTestId('open-dialog'))
    await waitFor(() => expect(getByTestId('el-dialog-stub').dataset.open).toBe('true'))

    await fireEvent.click(getByTestId('stub-dialog-close'))

    await waitFor(() => expect(closeSpy).toHaveBeenCalledTimes(1))
    expect(pushMock).toHaveBeenCalledWith(routePaths.products.root)
    await waitFor(() => expect(getByTestId('el-dialog-stub').dataset.open).toBe('false'))
  })
})
