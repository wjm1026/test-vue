// generated-by: ai-assist v1.0
// type: unit
// description: ReportsPage tests validating layout rendering and pagination wiring via useReportsPage composable.

import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { defineComponent, h, ref } from 'vue'

import ReportsPage from '@/views/reports/ReportsPage.vue'
import { SortOrder } from '@/enum'

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: {
    title: { type: String, required: true },
    total: { type: Number, default: 0 },
    showPagination: { type: Boolean, default: false },
  },
  emits: ['page-change'],
  setup(props, { slots, emit }) {
    return () =>
      h('section', { 'data-testid': 'layout-main' }, [
        h('h1', { 'data-testid': 'layout-title' }, props.title),
        h('div', { 'data-testid': 'layout-total' }, String(props.total)),
        slots.default ? slots.default() : null,
        props.showPagination
          ? h(
              'button',
              {
                'data-testid': 'layout-page-button',
                onClick: () => emit('page-change', 2),
              },
              'next',
            )
          : null,
      ])
  },
})

const SearchInputStub = defineComponent({
  name: 'SearchInput',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        'data-testid': 'search-input',
        placeholder: props.placeholder,
        value: props.modelValue,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLInputElement).value),
      })
  },
})

const BaseDatePickerStub = defineComponent({
  name: 'BaseDatePicker',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        'data-testid': `date-picker-${props.placeholder}`,
        placeholder: props.placeholder,
        value: props.modelValue,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLInputElement).value),
      })
  },
})

const ElTextStub = defineComponent({
  name: 'ElText',
  setup(_, { slots }) {
    return () => h('span', { 'data-testid': 'el-text' }, slots.default ? slots.default() : [])
  },
})

const ReportsTableStub = defineComponent({
  name: 'ReportsTable',
  props: {
    data: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    sortField: { type: String, default: '' },
    sortOrder: { type: String, default: '' },
  },
  emits: ['update:sortField', 'update:sortOrder'],
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'reports-table',
        'data-row-count': String(props.data.length),
        'data-loading': String(props.isLoading),
        'data-sort-field': props.sortField,
        'data-sort-order': props.sortOrder,
      })
  },
})

const reportListRef = ref({
  total: 5,
  reports: [
    {
      reportId: 'R-1',
      projectId: 10,
      imageUrl: '',
      projectName: 'プロジェクトA',
      productName: '商品A',
      startDate: '',
      endDate: '',
      reviewCount: 100,
      commentCount: 20,
      goodRatio: 80,
    },
  ],
})

const useReportsPageMock = vi.hoisted(() =>
  vi.fn(() => ({
    searchKeyword: ref(''),
    startDate: ref(''),
    endDate: ref(''),
    sortField: ref('reviewCount'),
    sortOrder: ref(SortOrder.Asc),
    reportList: reportListRef,
    isLoading: ref(false),
    pageChange: vi.fn(),
    disableStartDate: vi.fn(),
    disableEndDate: vi.fn(),
  })),
)

vi.mock('@/views/reports/useReportsPage', () => ({
  useReportsPage: useReportsPageMock,
}))

describe('ReportsPage', () => {
  it('renders layout, filters, and reports table with provided data', () => {
    // Purpose: validate main UI elements reflect composable data.
    const { getByTestId, getByText } = render(ReportsPage, {
      global: {
        stubs: {
          LayoutMain: LayoutMainStub,
          SearchInput: SearchInputStub,
          BaseDatePicker: BaseDatePickerStub,
          ElText: ElTextStub,
          ReportsTable: ReportsTableStub,
        },
      },
    })

    expect(getByTestId('layout-title').textContent).toBe('調査レポート')
    expect(getByTestId('layout-total').textContent).toBe('5')
    expect(getByTestId('search-input').getAttribute('placeholder')).toBe(
      'プロジェクト名、商品名で絞り込み',
    )
    expect(getByText('絞り込み')).toBeInTheDocument()
    expect(getByTestId('date-picker-開始日')).toBeInTheDocument()
    expect(getByTestId('date-picker-終了日')).toBeInTheDocument()
    expect(getByText('全5レポート')).toBeInTheDocument()
    expect(getByTestId('reports-table').getAttribute('data-row-count')).toBe('1')
    expect(getByTestId('reports-table').getAttribute('data-sort-field')).toBe('reviewCount')
  })

  it('propagates page-change events to the useReportsPage composable', async () => {
    // Purpose: ensure LayoutMain pagination forwards events to pageChange handler.
    const pageChangeSpy = vi.fn()
    useReportsPageMock.mockReturnValueOnce({
      searchKeyword: ref(''),
      startDate: ref(''),
      endDate: ref(''),
      sortField: ref('reviewCount'),
      sortOrder: ref(SortOrder.Asc),
      reportList: reportListRef,
      isLoading: ref(false),
      pageChange: pageChangeSpy,
      disableStartDate: vi.fn(),
      disableEndDate: vi.fn(),
    })

    const { getByTestId } = render(ReportsPage, {
      global: {
        stubs: {
          LayoutMain: LayoutMainStub,
          SearchInput: SearchInputStub,
          BaseDatePicker: BaseDatePickerStub,
          ElText: ElTextStub,
          ReportsTable: ReportsTableStub,
        },
      },
    })

    await fireEvent.click(getByTestId('layout-page-button'))
    expect(pageChangeSpy).toHaveBeenCalledWith(2)
  })

  it('updates search keyword when input value changes', async () => {
    // Purpose: verify search input binding updates keyword.
    const searchKeyword = ref('')
    const startDate = ref('')
    const endDate = ref('')
    const sortField = ref('reviewCount')
    const sortOrder = ref(SortOrder.Asc)
    const pageChange = vi.fn()

    useReportsPageMock.mockReturnValueOnce({
      searchKeyword,
      startDate,
      endDate,
      sortField,
      sortOrder,
      reportList: reportListRef,
      isLoading: ref(false),
      pageChange,
      disableStartDate: vi.fn(),
      disableEndDate: vi.fn(),
    })

    const { getByTestId } = render(ReportsPage, {
      global: {
        stubs: {
          LayoutMain: LayoutMainStub,
          SearchInput: SearchInputStub,
          BaseDatePicker: BaseDatePickerStub,
          ElText: ElTextStub,
          ReportsTable: ReportsTableStub,
        },
      },
    })

    const searchInput = getByTestId('search-input') as HTMLInputElement
    await fireEvent.update(searchInput, 'test query')
    expect(searchKeyword.value).toBe('test query')
  })

  it('updates start date and end date when date pickers change', async () => {
    // Purpose: verify date picker bindings update date refs.
    const searchKeyword = ref('')
    const startDate = ref('')
    const endDate = ref('')
    const sortField = ref('reviewCount')
    const sortOrder = ref(SortOrder.Asc)
    const pageChange = vi.fn()

    useReportsPageMock.mockReturnValueOnce({
      searchKeyword,
      startDate,
      endDate,
      sortField,
      sortOrder,
      reportList: reportListRef,
      isLoading: ref(false),
      pageChange,
      disableStartDate: vi.fn(),
      disableEndDate: vi.fn(),
    })

    const { getByTestId } = render(ReportsPage, {
      global: {
        stubs: {
          LayoutMain: LayoutMainStub,
          SearchInput: SearchInputStub,
          BaseDatePicker: BaseDatePickerStub,
          ElText: ElTextStub,
          ReportsTable: ReportsTableStub,
        },
      },
    })

    const startDatePicker = getByTestId('date-picker-開始日') as HTMLInputElement
    const endDatePicker = getByTestId('date-picker-終了日') as HTMLInputElement

    await fireEvent.update(startDatePicker, '2024-01-01')
    await fireEvent.update(endDatePicker, '2024-01-31')

    expect(startDate.value).toBe('2024-01-01')
    expect(endDate.value).toBe('2024-01-31')
  })

  it('displays loading state when isLoading is true', () => {
    // Purpose: verify loading state is reflected in table.
    const searchKeyword = ref('')
    const startDate = ref('')
    const endDate = ref('')
    const sortField = ref('reviewCount')
    const sortOrder = ref(SortOrder.Asc)
    const pageChange = vi.fn()

    useReportsPageMock.mockReturnValueOnce({
      searchKeyword,
      startDate,
      endDate,
      sortField,
      sortOrder,
      reportList: reportListRef,
      isLoading: ref(true),
      pageChange,
      disableStartDate: vi.fn(),
      disableEndDate: vi.fn(),
    })

    const { getByTestId } = render(ReportsPage, {
      global: {
        stubs: {
          LayoutMain: LayoutMainStub,
          SearchInput: SearchInputStub,
          BaseDatePicker: BaseDatePickerStub,
          ElText: ElTextStub,
          ReportsTable: ReportsTableStub,
        },
      },
    })

    expect(getByTestId('reports-table').getAttribute('data-loading')).toBe('true')
  })

  it('displays empty state when report list is empty', () => {
    // Purpose: verify empty state is handled correctly.
    const emptyReportList = ref({ total: 0, reports: [] })
    const searchKeyword = ref('')
    const startDate = ref('')
    const endDate = ref('')
    const sortField = ref('reviewCount')
    const sortOrder = ref(SortOrder.Asc)
    const pageChange = vi.fn()

    useReportsPageMock.mockReturnValueOnce({
      searchKeyword,
      startDate,
      endDate,
      sortField,
      sortOrder,
      reportList: emptyReportList,
      isLoading: ref(false),
      pageChange,
      disableStartDate: vi.fn(),
      disableEndDate: vi.fn(),
    })

    const { getByText } = render(ReportsPage, {
      global: {
        stubs: {
          LayoutMain: LayoutMainStub,
          SearchInput: SearchInputStub,
          BaseDatePicker: BaseDatePickerStub,
          ElText: ElTextStub,
          ReportsTable: ReportsTableStub,
        },
      },
    })

    expect(getByText('全0レポート')).toBeInTheDocument()
  })
})
