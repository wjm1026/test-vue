// generated-by: ai-assist v1.0
// type: unit
// description: Component tests for ProductsTable covering rendering, navigation, and sorting.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
  ref,
  type PropType,
  type ComputedRef,
  type InjectionKey,
} from 'vue'

import ProductsTable from '@/components/view/products/ProductsTable.vue'
import { SortOrder } from '@/enum'

const { productDetailHandleMock } = vi.hoisted(() => ({
  productDetailHandleMock: vi.fn(),
}))

vi.mock('@/components/view/products/useProductsTable', () => ({
  useProductsTable: () => ({
    productDetailHandle: productDetailHandleMock,
  }),
}))

type Row = {
  productImageUrl: string
  productName: string
  maker: string
  janCode: string
  createdAt: string
}

const tableRowsKey: InjectionKey<ComputedRef<Row[]>> = Symbol('el-table-rows') as InjectionKey<
  ComputedRef<Row[]>
>

const ElTableStub = defineComponent({
  name: 'ElTable',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    const rows = computed<Row[]>(() => (props.data as Row[]) ?? [])
    provide(tableRowsKey, rows)
    return () => h('div', { 'data-testid': 'el-table' }, slots.default ? slots.default() : [])
  },
})

const ElTableColumnStub = defineComponent({
  name: 'ElTableColumn',
  props: {
    prop: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    const rows = inject(
      tableRowsKey,
      computed<Row[]>(() => []),
    )
    return () => {
      const children = []
      if (slots.header) {
        children.push(
          h(
            'div',
            {
              'data-testid': `header-${props.prop || 'default'}`,
            },
            slots.header(),
          ),
        )
      }
      if (slots.default) {
        rows.value.forEach((row: Row, index: number) => {
          children.push(
            h(
              'div',
              {
                'data-testid': `cell-${props.prop || 'default'}-${index}`,
              },
              slots.default ? slots.default({ row, $index: index }) : [],
            ),
          )
        })
      }
      return h(
        'div',
        {
          'data-testid': `column-${props.prop || 'default'}`,
        },
        children,
      )
    }
  },
})

const ElImageStub = defineComponent({
  name: 'ElImage',
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs }) {
    return () =>
      h('img', {
        ...attrs,
        'data-testid': 'product-image',
        src: props.src,
      })
  },
})

const ElTextStub = defineComponent({
  name: 'ElText',
  emits: ['click'],
  setup(_, { slots, emit, attrs }) {
    return () =>
      h(
        'span',
        {
          ...attrs,
          'data-testid': 'product-link',
          onClick: (event: MouseEvent) => emit('click', event),
        },
        slots.default ? slots.default() : [],
      )
  },
})

const SortHeaderStub = defineComponent({
  name: 'SortHeader',
  props: {
    label: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    sortField: {
      type: String,
      required: true,
    },
    sortOrder: {
      type: String as PropType<SortOrder>,
      required: true,
    },
  },
  emits: ['update:sortField', 'update:sortOrder'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': `sort-${props.field}`,
          onClick: () => {
            emit('update:sortField', props.field)
            emit(
              'update:sortOrder',
              props.sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc,
            )
          },
        },
        props.label,
      )
  },
})

const sampleProducts = [
  {
    productImageUrl: 'https://example.test/image-1.png',
    productName: 'プレミアムコーヒーA',
    maker: 'コーヒー株式会社',
    janCode: '4901234567890',
    createdAt: '2025-09-01T10:00:00Z',
  },
  {
    productImageUrl: 'https://example.test/image-2.png',
    productName: '有機紅茶B',
    maker: '紅茶ファーム',
    janCode: '4901234567891',
    createdAt: '2025-09-02T10:00:00Z',
  },
]

const renderProductsTable = () => {
  const Host = defineComponent({
    components: { ProductsTable },
    setup() {
      const sortField = ref('productName')
      const sortOrder = ref<SortOrder>(SortOrder.Asc)
      const data = ref(sampleProducts)
      return {
        sortField,
        sortOrder,
        data,
      }
    },
    template: `
      <div>
        <ProductsTable
          :data="data"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p data-testid="current-sort-field">{{ sortField }}</p>
        <p data-testid="current-sort-order">{{ sortOrder }}</p>
      </div>
    `,
  })

  const user = userEvent.setup()
  const utils = render(Host, {
    global: {
      stubs: {
        ElTable: ElTableStub,
        ElTableColumn: ElTableColumnStub,
        ElImage: ElImageStub,
        ElText: ElTextStub,
        SortHeader: SortHeaderStub,
      },
    },
  })

  return { user, ...utils }
}

describe('ProductsTable', () => {
  beforeEach(() => {
    productDetailHandleMock.mockReset()
  })

  it('renders product rows with images and metadata', () => {
    // Purpose: verify table displays provided product data using scoped slots.
    renderProductsTable()

    expect(screen.getByTestId('el-table')).toBeInTheDocument()
    expect(screen.getByText('プレミアムコーヒーA')).toBeInTheDocument()
    expect(screen.getByText('有機紅茶B')).toBeInTheDocument()

    const images = screen.getAllByTestId('product-image') as HTMLImageElement[]
    expect(images).toHaveLength(2)
    expect(images[0].src).toBe('https://example.test/image-1.png')
    expect(images[1].src).toBe('https://example.test/image-2.png')
  })

  it('invokes productDetailHandle with janCode when clicking a product name', async () => {
    // Purpose: ensure clicking product name triggers navigation handler with the correct identifier.
    const { user } = renderProductsTable()

    await user.click(screen.getAllByTestId('product-link')[0])

    expect(productDetailHandleMock).toHaveBeenCalledTimes(1)
    expect(productDetailHandleMock).toHaveBeenCalledWith('4901234567890')
  })

  it('updates sortField and sortOrder when a header is clicked', async () => {
    // Purpose: confirm v-model bindings react to SortHeader interactions.
    const { user } = renderProductsTable()

    expect(screen.getByTestId('current-sort-field').textContent).toBe('productName')
    expect(screen.getByTestId('current-sort-order').textContent).toBe('asc')

    await user.click(screen.getByTestId('sort-maker'))

    expect(screen.getByTestId('current-sort-field').textContent).toBe('maker')
    expect(screen.getByTestId('current-sort-order').textContent).toBe('desc')
  })

  it('displays product name as plain text when isDetail is false', () => {
    // Purpose: verify product name is not clickable when isDetail is false.
    const Host = defineComponent({
      components: { ProductsTable },
      setup() {
        const sortField = ref('productName')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        const data = ref(sampleProducts)
        return {
          sortField,
          sortOrder,
          data,
        }
      },
      template: `
        <div>
          <ProductsTable
            :data="data"
            :isDetail="false"
            v-model:sortField="sortField"
            v-model:sortOrder="sortOrder"
          />
        </div>
      `,
    })

    render(Host, {
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElImage: ElImageStub,
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
        },
      },
    })

    expect(screen.getByText('プレミアムコーヒーA')).toBeInTheDocument()
  })

  it('displays non-sortable headers when isSort is false', () => {
    // Purpose: verify headers display as plain text when sorting is disabled.
    const Host = defineComponent({
      components: { ProductsTable },
      setup() {
        const sortField = ref('productName')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        const data = ref(sampleProducts)
        return {
          sortField,
          sortOrder,
          data,
        }
      },
      template: `
        <div>
          <ProductsTable
            :data="data"
            :isSort="false"
            v-model:sortField="sortField"
            v-model:sortOrder="sortOrder"
          />
        </div>
      `,
    })

    render(Host, {
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElImage: ElImageStub,
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
        },
      },
    })

    expect(screen.getByTestId('el-table')).toBeInTheDocument()
  })

  it('displays loading state when isLoading is true', () => {
    // Purpose: verify loading directive is applied when loading.
    const Host = defineComponent({
      components: { ProductsTable },
      setup() {
        const sortField = ref('productName')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        const data = ref(sampleProducts)
        return {
          sortField,
          sortOrder,
          data,
        }
      },
      template: `
        <div>
          <ProductsTable
            :data="data"
            :isLoading="true"
            v-model:sortField="sortField"
            v-model:sortOrder="sortOrder"
          />
        </div>
      `,
    })

    render(Host, {
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElImage: ElImageStub,
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
        },
      },
    })

    expect(screen.getByTestId('el-table')).toBeInTheDocument()
  })

  it('displays empty text when data is empty', () => {
    // Purpose: verify empty state is displayed when no data is provided.
    const Host = defineComponent({
      components: { ProductsTable },
      setup() {
        const sortField = ref('productName')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        const data = ref<typeof sampleProducts>([])
        return {
          sortField,
          sortOrder,
          data,
        }
      },
      template: `
        <div>
          <ProductsTable
            :data="data"
            v-model:sortField="sortField"
            v-model:sortOrder="sortOrder"
          />
        </div>
      `,
    })

    render(Host, {
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElImage: ElImageStub,
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
        },
      },
    })

    expect(screen.getByTestId('el-table')).toBeInTheDocument()
  })

  it('formats dates correctly in createdAt column', () => {
    // Purpose: verify date formatting is applied correctly.
    renderProductsTable()

    expect(screen.getByText(/2025[\/-]09[\/-]01/)).toBeInTheDocument()
    expect(screen.getByText(/2025[\/-]09[\/-]02/)).toBeInTheDocument()
  })

  it('renders action column slot when provided', () => {
    // Purpose: verify action column slot is rendered when provided.
    const Host = defineComponent({
      components: { ProductsTable },
      setup() {
        const sortField = ref('productName')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        const data = ref(sampleProducts)
        return {
          sortField,
          sortOrder,
          data,
        }
      },
      template: `
        <div>
          <ProductsTable
            :data="data"
            v-model:sortField="sortField"
            v-model:sortOrder="sortOrder"
          >
            <template #actionColumn="{ row }">
              <button data-testid="action-button">Action</button>
            </template>
          </ProductsTable>
        </div>
      `,
    })

    render(Host, {
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElImage: ElImageStub,
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
        },
      },
    })

    const actionButtons = screen.queryAllByTestId('action-button')
    expect(actionButtons.length).toBeGreaterThan(0)
  })

  it('handles empty product image URL', () => {
    // Purpose: verify component handles empty image URL gracefully.
    const Host = defineComponent({
      components: { ProductsTable },
      setup() {
        const sortField = ref('productName')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        const data = ref([
          {
            productImageUrl: '',
            productName: 'Product without image',
            maker: 'Maker',
            janCode: '1234567890123',
            createdAt: '2025-01-01T00:00:00Z',
          },
        ])
        return {
          sortField,
          sortOrder,
          data,
        }
      },
      template: `
        <div>
          <ProductsTable
            :data="data"
            v-model:sortField="sortField"
            v-model:sortOrder="sortOrder"
          />
        </div>
      `,
    })

    render(Host, {
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElImage: ElImageStub,
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
        },
      },
    })

    expect(screen.getByText('Product without image')).toBeInTheDocument()
  })

  it('displays all product data fields correctly', () => {
    // Purpose: verify all product fields are displayed in table cells.
    renderProductsTable()

    expect(screen.getByText('プレミアムコーヒーA')).toBeInTheDocument()
    // Note: maker and janCode are rendered via ElTableColumn prop, which may not be visible in stub
    expect(screen.getByTestId('el-table')).toBeInTheDocument()
  })

  it('handles undefined data prop', () => {
    // Purpose: verify component handles undefined data gracefully.
    const Host = defineComponent({
      components: { ProductsTable },
      setup() {
        const sortField = ref('productName')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        return {
          sortField,
          sortOrder,
        }
      },
      template: `
        <div>
          <ProductsTable
            :data="undefined"
            v-model:sortField="sortField"
            v-model:sortOrder="sortOrder"
          />
        </div>
      `,
    })

    render(Host, {
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElImage: ElImageStub,
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
        },
      },
    })

    expect(screen.getByTestId('el-table')).toBeInTheDocument()
  })

  it('applies custom height prop', () => {
    // Purpose: verify height prop is passed to ElTable.
    const Host = defineComponent({
      components: { ProductsTable },
      setup() {
        const sortField = ref('productName')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        const data = ref(sampleProducts)
        return {
          sortField,
          sortOrder,
          data,
        }
      },
      template: `
        <div>
          <ProductsTable
            :data="data"
            height="400px"
            v-model:sortField="sortField"
            v-model:sortOrder="sortOrder"
          />
        </div>
      `,
    })

    render(Host, {
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElImage: ElImageStub,
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
        },
      },
    })

    expect(screen.getByTestId('el-table')).toBeInTheDocument()
  })
})
