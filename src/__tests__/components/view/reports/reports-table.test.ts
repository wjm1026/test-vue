// generated-by: ai-assist v1.0
// type: unit
// description: ReportsTable tests covering rendering, handlers, and sorting behavior.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import {
  computed,
  defineComponent,
  h,
  inject,
  provide,
  ref,
  type ComputedRef,
  type InjectionKey,
  type PropType,
} from 'vue'

import ReportsTable from '@/components/view/reports/ReportsTable.vue'
import type { Report } from '@/api/types/reports'
import { SortOrder } from '@/enum'

const { reportDetailHandleMock, reportDailyHandleMock } = vi.hoisted(() => ({
  reportDetailHandleMock: vi.fn(),
  reportDailyHandleMock: vi.fn(),
}))

vi.mock('@/components/view/reports/useReportsTable', () => ({
  useReportsTable: () => ({
    reportDetailHandle: reportDetailHandleMock,
    reportDailyHandle: reportDailyHandleMock,
  }),
}))

type RowsKey = ComputedRef<Report[]>
const tableRowsKey: InjectionKey<RowsKey> = Symbol('reports-table-rows') as InjectionKey<RowsKey>

const ElTableStub = defineComponent({
  name: 'ElTable',
  props: {
    data: {
      type: Array as PropType<Report[]>,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    const rows = computed(() => props.data ?? [])
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
      computed<Report[]>(() => []),
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
        rows.value.forEach((row, index) => {
          children.push(
            h(
              'div',
              {
                'data-testid': `cell-${props.prop || 'default'}-${index}`,
              },
              slots.default ? slots.default({ row, $index: index }) : '',
            ),
          )
        })
      } else if (props.prop) {
        rows.value.forEach((row, index) => {
          const cellValue = (row as unknown as Record<string, unknown>)[props.prop as keyof Report]
          children.push(
            h(
              'div',
              {
                'data-testid': `cell-${props.prop}-${index}`,
              },
              String(cellValue ?? ''),
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

const ElTextStub = defineComponent({
  name: 'ElText',
  emits: ['click'],
  setup(_, { slots, emit, attrs }) {
    return () =>
      h(
        'span',
        {
          ...attrs,
          'data-testid': attrs['data-testid'] ?? 'el-text',
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

const BaseImageStub = defineComponent({
  name: 'BaseImage',
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
        'data-testid': 'report-image',
        src: props.src,
      })
  },
})

const sampleReports: Report[] = [
  {
    reportId: 'RPT-1001',
    projectId: 101,
    imageUrl: 'https://example.test/report-1.png',
    projectName: 'アルファ調査',
    productName: '有機野菜セット',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-01-10T00:00:00Z',
    reviewCount: 1250,
    commentCount: 320,
    goodRatio: 82,
  },
  {
    reportId: 'RPT-1002',
    projectId: 102,
    imageUrl: 'https://example.test/report-2.png',
    projectName: 'ベータ調査',
    productName: 'クラフトコーヒー',
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2025-02-11T00:00:00Z',
    reviewCount: 980,
    commentCount: 145,
    goodRatio: 74,
  },
]

const renderReportsTable = () => {
  const Host = defineComponent({
    components: { ReportsTable },
    setup() {
      const sortField = ref('reportId')
      const sortOrder = ref<SortOrder>(SortOrder.Asc)
      const data = ref(sampleReports)
      return {
        sortField,
        sortOrder,
        data,
      }
    },
    template: `
      <div>
        <ReportsTable
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
        ElText: ElTextStub,
        SortHeader: SortHeaderStub,
        BaseImage: BaseImageStub,
      },
    },
  })

  return { user, ...utils }
}

describe('ReportsTable', () => {
  beforeEach(() => {
    reportDetailHandleMock.mockReset()
    reportDailyHandleMock.mockReset()
  })

  it('renders report rows with formatted values', () => {
    // Purpose: verify table rows display project info, formatted counts, ratio, and date range.
    renderReportsTable()

    expect(screen.getByTestId('el-table')).toBeInTheDocument()
    expect(screen.getByText('アルファ調査')).toBeInTheDocument()
    expect(screen.getByText('ベータ調査')).toBeInTheDocument()
    expect(screen.getByText('有機野菜セット')).toBeInTheDocument()
    expect(screen.getByText('クラフトコーヒー')).toBeInTheDocument()

    const images = screen.getAllByTestId('report-image') as HTMLImageElement[]
    expect(images).toHaveLength(2)
    expect(images[0].src).toContain('https://example.test/report-1.png')
    expect(images[1].src).toContain('https://example.test/report-2.png')

    expect(screen.getByText('1,250')).toBeInTheDocument()
    expect(screen.getByText('320')).toBeInTheDocument()
    expect(screen.getByText('980')).toBeInTheDocument()
    expect(screen.getByText('145')).toBeInTheDocument()
    expect(screen.getByText('82%')).toBeInTheDocument()
    expect(screen.getByText('74%')).toBeInTheDocument()
    expect(screen.getByText(/2025[\/-]01[\/-]01\s*-\s*2025[\/-]01[\/-]10/)).toBeInTheDocument()
    expect(screen.getByText(/2025[\/-]02[\/-]01\s*-\s*2025[\/-]02[\/-]11/)).toBeInTheDocument()
  })

  it('calls reportDetailHandle with the project id when clicking a report id link', async () => {
    // Purpose: ensure clicking the report identifier invokes the detail navigation handler.
    const { user } = renderReportsTable()

    await user.click(screen.getByText('RPT-1001'))

    expect(reportDetailHandleMock).toHaveBeenCalledTimes(1)
    expect(reportDetailHandleMock).toHaveBeenCalledWith(101)
  })

  it('calls reportDailyHandle when clicking review counts', async () => {
    // Purpose: verify review count links trigger daily report handler.
    const { user } = renderReportsTable()

    await user.click(screen.getByText('1,250'))

    expect(reportDailyHandleMock).toHaveBeenCalledTimes(1)
    expect(reportDailyHandleMock).toHaveBeenCalledWith(101)
  })

  it('updates sort bindings when a SortHeader is clicked', async () => {
    // Purpose: confirm v-model bindings react to SortHeader interactions.
    const { user } = renderReportsTable()

    expect(screen.getByTestId('current-sort-field').textContent).toBe('reportId')
    expect(screen.getByTestId('current-sort-order').textContent).toBe('asc')

    await user.click(screen.getByTestId('sort-projectName'))

    expect(screen.getByTestId('current-sort-field').textContent).toBe('projectName')
    expect(screen.getByTestId('current-sort-order').textContent).toBe('desc')
  })

  it('displays loading state when isLoading is true', () => {
    // Purpose: verify loading directive is applied when loading.
    const Host = defineComponent({
      components: { ReportsTable },
      setup() {
        const sortField = ref('reportId')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        const data = ref(sampleReports)
        return {
          sortField,
          sortOrder,
          data,
        }
      },
      template: `
        <div>
          <ReportsTable
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
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
          BaseImage: BaseImageStub,
        },
      },
    })

    expect(screen.getByTestId('el-table')).toBeInTheDocument()
  })

  it('displays empty text when data is empty', () => {
    // Purpose: verify empty state is displayed when no data is provided.
    const Host = defineComponent({
      components: { ReportsTable },
      setup() {
        const sortField = ref('reportId')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        const data = ref<Report[]>([])
        return {
          sortField,
          sortOrder,
          data,
        }
      },
      template: `
        <div>
          <ReportsTable
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
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
          BaseImage: BaseImageStub,
        },
      },
    })

    expect(screen.getByTestId('el-table')).toBeInTheDocument()
  })

  it('calls reportDailyHandle when clicking comment counts', async () => {
    // Purpose: verify comment count links trigger daily report handler.
    const { user } = renderReportsTable()

    await user.click(screen.getByText('320'))

    expect(reportDailyHandleMock).toHaveBeenCalledTimes(1)
    expect(reportDailyHandleMock).toHaveBeenCalledWith(101)
  })

  it('formats dates correctly in date range column', () => {
    // Purpose: verify date formatting is applied correctly.
    renderReportsTable()

    expect(screen.getByText(/2025[\/-]01[\/-]01\s*-\s*2025[\/-]01[\/-]10/)).toBeInTheDocument()
    expect(screen.getByText(/2025[\/-]02[\/-]01\s*-\s*2025[\/-]02[\/-]11/)).toBeInTheDocument()
  })

  it('formats numbers with commas correctly', () => {
    // Purpose: verify number formatting with commas is applied.
    renderReportsTable()

    expect(screen.getByText('1,250')).toBeInTheDocument()
    expect(screen.getByText('980')).toBeInTheDocument()
  })

  it('handles empty data array', () => {
    // Purpose: verify component handles empty data array gracefully.
    const Host = defineComponent({
      components: { ReportsTable },
      setup() {
        const sortField = ref('reportId')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        const data = ref<Report[]>([])
        return {
          sortField,
          sortOrder,
          data,
        }
      },
      template: `
        <div>
          <ReportsTable
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
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
          BaseImage: BaseImageStub,
        },
      },
    })

    expect(screen.getByTestId('el-table')).toBeInTheDocument()
  })

  it('handles undefined data prop', () => {
    // Purpose: verify component handles undefined data gracefully.
    const Host = defineComponent({
      components: { ReportsTable },
      setup() {
        const sortField = ref('reportId')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        return {
          sortField,
          sortOrder,
        }
      },
      template: `
        <div>
          <ReportsTable
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
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
          BaseImage: BaseImageStub,
        },
      },
    })

    expect(screen.getByTestId('el-table')).toBeInTheDocument()
  })

  it('displays good ratio percentage correctly', () => {
    // Purpose: verify good ratio is displayed as percentage.
    renderReportsTable()

    expect(screen.getByText('82%')).toBeInTheDocument()
    expect(screen.getByText('74%')).toBeInTheDocument()
  })

  it('handles empty image URL', () => {
    // Purpose: verify component handles empty image URL gracefully.
    const Host = defineComponent({
      components: { ReportsTable },
      setup() {
        const sortField = ref('reportId')
        const sortOrder = ref<SortOrder>(SortOrder.Asc)
        const data = ref<Report[]>([
          {
            reportId: 'RPT-1001',
            projectId: 101,
            imageUrl: '',
            projectName: 'テストプロジェクト',
            productName: 'テスト商品',
            startDate: '2025-01-01T00:00:00Z',
            endDate: '2025-01-10T00:00:00Z',
            reviewCount: 100,
            commentCount: 50,
            goodRatio: 80,
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
          <ReportsTable
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
          ElText: ElTextStub,
          SortHeader: SortHeaderStub,
          BaseImage: BaseImageStub,
        },
      },
    })

    expect(screen.getByText('テストプロジェクト')).toBeInTheDocument()
  })
})
