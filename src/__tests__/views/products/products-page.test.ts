// generated-by: ai-assist v1.0
// type: unit
// description: Component tests for ProductsPage verifying layout wiring and interactions.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { computed, defineComponent, h } from 'vue'

import ProductsPage from '@/views/products/ProductsPage.vue'

const useProductsPageMock = vi.hoisted(() => vi.fn())

vi.mock('@/views/products/useProductsPage', () => ({
  useProductsPage: useProductsPageMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: {
    title: {
      type: String,
      default: '',
    },
    total: {
      type: Number,
      required: false,
    },
    showPagination: {
      type: Boolean,
      default: false,
    },
    page: {
      type: Number,
      default: 1,
    },
  },
  emits: ['page-change'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'section',
        {
          'data-testid': 'layout-main',
          'data-title': props.title,
          'data-total': props.total,
          'data-show-pagination': props.showPagination,
          'data-page': props.page,
          onPageChange: (event: CustomEvent<number>) => emit('page-change', event.detail),
        },
        slots.default ? slots.default() : [],
      )
  },
})

const AddButtonStub = defineComponent({
  name: 'AddButton',
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
          'data-testid': 'add-button',
          onClick: () => emit('click'),
        },
        props.label,
      )
  },
})

const SearchInputStub = defineComponent({
  name: 'SearchInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        type: 'text',
        'data-testid': 'search-input',
        value: props.modelValue,
        placeholder: props.placeholder,
        onInput: (event: Event) => {
          const target = event.target as HTMLInputElement
          emit('update:modelValue', target.value)
        },
      })
  },
})

const ProductsTableStub = defineComponent({
  name: 'ProductsTable',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    sortField: {
      type: String,
      required: true,
    },
    sortOrder: {
      type: String,
      required: true,
    },
  },
  emits: ['update:sortField', 'update:sortOrder'],
  setup(props, { emit }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'products-table',
          'data-sort-field': props.sortField,
          'data-sort-order': props.sortOrder,
        },
        [
          h(
            'button',
            {
              'data-testid': 'table-sort-change',
              type: 'button',
              onClick: () => {
                emit('update:sortField', 'maker')
                emit('update:sortOrder', 'desc')
              },
            },
            'sort',
          ),
          (props.data as Array<{ productName: string }> | undefined)?.map((item, index: number) =>
            h(
              'p',
              {
                key: index,
              },
              item.productName,
            ),
          ),
        ],
      )
  },
})

describe('ProductsPage', () => {
  beforeEach(() => {
    useProductsPageMock.mockReset()
  })

  it('renders layout with product list data and bindings', () => {
    // Purpose: ensure page wires LayoutMain and child props from composable values.
    useProductsPageMock.mockReturnValue({
      productList: computed(() => ({
        total: 10,
        products: [{ productName: 'プレミアムコーヒーA' }],
      })),
      page: computed(() => 2),
      searchKeyword: computed({
        get: () => '',
        set: vi.fn(),
      }),
      pageChange: vi.fn(),
      productAdd: vi.fn(),
      sortField: computed({
        get: () => 'productName',
        set: vi.fn(),
      }),
      sortOrder: computed({
        get: () => 'asc',
        set: vi.fn(),
      }),
    })

    render(ProductsPage, {
      global: {
        stubs: {
          LayoutMain: LayoutMainStub,
          AddButton: AddButtonStub,
          SearchInput: SearchInputStub,
          ProductsTable: ProductsTableStub,
          ElText: defineComponent({
            name: 'ElText',
            setup(_, { slots }) {
              return () =>
                h('span', { 'data-testid': 'el-text' }, slots.default ? slots.default() : [])
            },
          }),
        },
      },
    })

    const layout = screen.getByTestId('layout-main')
    expect(layout.getAttribute('data-title')).toBe('商品管理')
    expect(layout.getAttribute('data-total')).toBe('10')
    expect(layout.getAttribute('data-show-pagination')).toBe('true')
    expect(layout.getAttribute('data-page')).toBe('2')
    expect(screen.getByText('全10商品')).toBeInTheDocument()
    expect(screen.getByText('プレミアムコーヒーA')).toBeInTheDocument()
  })

  it('handles interactions for add button, search, sorting, and pagination', async () => {
    // Purpose: verify user interactions propagate to composable methods and v-model setters.
    const pageChangeMock = vi.fn()
    const productAddMock = vi.fn()
    const searchSetter = vi.fn()
    const sortFieldSetter = vi.fn()
    const sortOrderSetter = vi.fn()

    useProductsPageMock.mockReturnValue({
      productList: computed(() => ({
        total: 2,
        products: [{ productName: '有機紅茶B' }, { productName: '炭酸水H' }],
      })),
      page: computed({
        get: () => 1,
        set: pageChangeMock,
      }),
      searchKeyword: computed({
        get: () => '',
        set: searchSetter,
      }),
      pageChange: pageChangeMock,
      productAdd: productAddMock,
      sortField: computed({
        get: () => 'productName',
        set: sortFieldSetter,
      }),
      sortOrder: computed({
        get: () => 'asc',
        set: sortOrderSetter,
      }),
    })

    const user = userEvent.setup()
    render(ProductsPage, {
      global: {
        stubs: {
          LayoutMain: LayoutMainStub,
          AddButton: AddButtonStub,
          SearchInput: SearchInputStub,
          ProductsTable: ProductsTableStub,
          ElText: defineComponent({
            name: 'ElText',
            setup(_, { slots }) {
              return () =>
                h('span', { 'data-testid': 'el-text' }, slots.default ? slots.default() : [])
            },
          }),
        },
      },
    })

    await user.click(screen.getByTestId('add-button'))
    expect(productAddMock).toHaveBeenCalledTimes(1)

    await user.type(screen.getByTestId('search-input'), 'コーヒー')
    expect(searchSetter).toHaveBeenCalled()

    await user.click(screen.getByTestId('table-sort-change'))
    expect(sortFieldSetter).toHaveBeenCalledWith('maker')
    expect(sortOrderSetter).toHaveBeenCalledWith('desc')

    const layout = screen.getByTestId('layout-main')
    const pageChangeEvent = new CustomEvent('page-change', { detail: 3 })
    layout.dispatchEvent(pageChangeEvent)
    expect(pageChangeMock).toHaveBeenCalledWith(3)
  })
})
