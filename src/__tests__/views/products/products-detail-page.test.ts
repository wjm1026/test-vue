// generated-by: ai-assist v1.0
// type: unit
// description: ProductsDetailPage tests verifying render state and action bindings.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { fireEvent, render } from '@testing-library/vue'

import ProductsDetailPage from '@/views/products/detail/ProductsDetailPage.vue'

const useProductsDetailPageMock = vi.hoisted(() => vi.fn())

vi.mock('@/views/products/detail/useProductsDetailPage', () => ({
  useProductsDetailPage: useProductsDetailPageMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: {
    title: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'section',
        { 'data-testid': 'layout-main', 'data-title': props.title },
        slots.default ? slots.default() : [],
      )
  },
})

const SectionTitleStub = defineComponent({
  name: 'SectionTitle',
  props: {
    content: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h('h2', {
        'data-testid': 'section-title',
        'data-content': props.content,
      })
  },
})

const ContentTextStub = defineComponent({
  name: 'ContentText',
  props: {
    data: { type: Array, default: () => [] },
  },
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'content-text',
        'data-items': JSON.stringify(props.data),
      })
  },
})

const BaseImageStub = defineComponent({
  name: 'BaseImage',
  props: {
    src: { type: String, default: '' },
  },
  setup(props) {
    return () =>
      h('img', {
        'data-testid': 'base-image',
        src: props.src,
      })
  },
})

const WhiteButtonStub = defineComponent({
  name: 'WhiteButton',
  props: {
    label: { type: String, required: true },
    loading: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          'data-testid': `white-button-${props.label}`,
          'data-loading': String(props.loading),
          onClick: () => emit('click'),
        },
        slots.default ? slots.default() : props.label,
      )
  },
})

const ElTextStub = defineComponent({
  name: 'ElText',
  setup(_, { slots }) {
    return () => h('span', { 'data-testid': 'el-text' }, slots.default ? slots.default() : [])
  },
})

const WithDeleteConfirmStub = defineComponent({
  name: 'WithDeleteConfirm',
  props: {
    title: { type: String, required: true },
    loading: { type: Boolean, default: false },
  },
  emits: ['confirm'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'with-delete-confirm',
          'data-title': props.title,
          'data-loading': String(props.loading),
        },
        [
          slots.content ? h('div', { 'data-testid': 'confirm-content' }, slots.content()) : null,
          slots.default ? h('div', { 'data-testid': 'confirm-default' }, slots.default()) : null,
          h(
            'button',
            {
              'data-testid': 'with-delete-confirm-trigger',
              onClick: () => emit('confirm'),
            },
            'confirm',
          ),
        ],
      )
  },
})

const loadingDirective = vi.fn()

const productDetailState = () => {
  const updateHandle = vi.fn()
  const deleteHandle = vi.fn()
  return {
    imageUrl: ref('https://cdn/img.png'),
    summary: ref([
      { label: '商品名', text: '特製フライドポテト' },
      { label: 'メーカー', text: 'ACME' },
      { label: 'JANコード', text: 'JAN-100' },
    ]),
    detail: ref([{ label: '商品説明', text: 'crispy fries' }]),
    productDetail: ref({
      productId: 10,
      productName: '特製フライドポテト',
      maker: 'ACME',
    }),
    isLoading: ref(false),
    isDeleteLoading: ref(false),
    updateHandle,
    deleteHandle,
  }
}

const renderPage = () =>
  render(ProductsDetailPage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        SectionTitle: SectionTitleStub,
        ContentText: ContentTextStub,
        BaseImage: BaseImageStub,
        WhiteButton: WhiteButtonStub,
        ElText: ElTextStub,
        WithDeleteConfirm: WithDeleteConfirmStub,
      },
      directives: {
        loading: loadingDirective,
      },
    },
  })

describe('ProductsDetailPage', () => {
  beforeEach(() => {
    useProductsDetailPageMock.mockReset()
    loadingDirective.mockReset()
  })

  it('renders layout, summary/detail sections, and product info', () => {
    // Purpose: confirm the page renders product imagery/text based on composable state.
    useProductsDetailPageMock.mockReturnValue(productDetailState())

    const { getByTestId, getAllByTestId } = renderPage()

    expect(getByTestId('layout-main').getAttribute('data-title')).toBe('特製フライドポテト')
    const contentBlocks = getAllByTestId('content-text')
    expect(JSON.parse(contentBlocks[0].getAttribute('data-items') || '[]')).toEqual([
      { label: '商品名', text: '特製フライドポテト' },
      { label: 'メーカー', text: 'ACME' },
      { label: 'JANコード', text: 'JAN-100' },
    ])
    expect(JSON.parse(contentBlocks[1].getAttribute('data-items') || '[]')).toEqual([
      { label: '商品説明', text: 'crispy fries' },
    ])
    const images = getAllByTestId('base-image')
    expect(images[0].getAttribute('src')).toBe('https://cdn/img.png')
    expect(images[1].getAttribute('src')).toBe('https://cdn/img.png')
    expect(getByTestId('confirm-content').textContent).toContain('特製フライドポテト')
  })

  it('wires action handlers for update and delete buttons', async () => {
    // Purpose: ensure updateHandle/deleteHandle are triggered from corresponding controls.
    const state = productDetailState()
    state.isDeleteLoading.value = true
    useProductsDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    await fireEvent.click(getByTestId('white-button-編集する'))
    expect(state.updateHandle).toHaveBeenCalled()

    expect(getByTestId('with-delete-confirm').getAttribute('data-loading')).toBe('true')
    await fireEvent.click(getByTestId('with-delete-confirm-trigger'))
    expect(state.deleteHandle).toHaveBeenCalled()
  })
})
