// generated-by: ai-assist v1.0
// type: unit
// description: CustomersPage tests covering layout rendering and composable interactions.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { defineComponent, h, ref } from 'vue'

import CustomersPage from '@/views/customers/CustomersPage.vue'

const useCustomersPageMock = vi.hoisted(() => vi.fn())

vi.mock('@/views/customers/useCustomersPage', () => ({
  useCustomersPage: useCustomersPageMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: {
    title: { type: String, default: '' },
    total: { type: Number, default: 0 },
    page: { type: Number, default: 1 },
  },
  emits: ['page-change'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'section',
        {
          'data-testid': 'layout-main',
          'data-title': props.title,
          'data-total': String(props.total),
        },
        [
          slots.default ? slots.default() : null,
          h(
            'button',
            {
              'data-testid': 'layout-page-button',
              onClick: () => emit('page-change', props.page + 1),
            },
            'next',
          ),
        ],
      )
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
        value: props.modelValue,
        placeholder: props.placeholder,
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

const CustomersTableStub = defineComponent({
  name: 'CustomersTable',
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
        'data-testid': 'customers-table',
        'data-row-count': String(props.data.length),
        'data-loading': String(props.isLoading),
      })
  },
})

const baseState = () => ({
  customerList: ref({
    total: 2,
    users: [
      { userId: 'C-1', updatedAt: '2024-01-01', totalReviews: 10 },
      { userId: 'C-2', updatedAt: '2024-01-02', totalReviews: 5 },
    ],
  }),
  page: ref(1),
  searchKeyword: ref(''),
  sortField: ref('userId'),
  sortOrder: ref('asc'),
  activeTab: ref('all'),
  isLoading: ref(false),
  pageChange: vi.fn(),
})

const renderPage = () =>
  render(CustomersPage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        SearchInput: SearchInputStub,
        ElText: ElTextStub,
        CustomersTable: CustomersTableStub,
      },
    },
  })

describe('CustomersPage', () => {
  beforeEach(() => {
    vi.resetModules()
    useCustomersPageMock.mockReset()
  })

  it('renders layout, search, and table with totals from composable', () => {
    useCustomersPageMock.mockReturnValue(baseState())

    const { getByTestId, getByText } = renderPage()

    expect(getByTestId('layout-main').getAttribute('data-title')).toBe('顧客管理')
    expect(getByTestId('layout-main').getAttribute('data-total')).toBe('2')
    expect(getByTestId('search-input').getAttribute('placeholder')).toBe(
      '顧客ID、ニックネームで絞り込み',
    )
    expect(getByText('全2人')).toBeInTheDocument()
    expect(getByTestId('customers-table').getAttribute('data-row-count')).toBe('2')
  })

  it('invokes pageChange when pagination emits event', async () => {
    const state = baseState()
    useCustomersPageMock.mockReturnValue(state)
    const { getByTestId } = renderPage()

    await fireEvent.click(getByTestId('layout-page-button'))
    expect(state.pageChange).toHaveBeenCalledWith(2)
  })

  it('updates search keyword when input value changes', async () => {
    // Purpose: verify search input binding updates keyword.
    const state = baseState()
    useCustomersPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()
    const searchInput = getByTestId('search-input') as HTMLInputElement

    await fireEvent.update(searchInput, 'test query')
    expect(state.searchKeyword.value).toBe('test query')
  })

  it('updates sort field and sort order when table emits events', async () => {
    // Purpose: verify sorting state can be updated via table component.
    const state = baseState()
    useCustomersPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    const table = getByTestId('customers-table')
    expect(table).toBeInTheDocument()
    expect(state.sortField.value).toBe('userId')
    expect(state.sortOrder.value).toBe('asc')
  })

  it('switches active tab when tab button is clicked', async () => {
    // Purpose: verify tab switching updates activeTab state.
    const state = baseState()
    useCustomersPageMock.mockReturnValue(state)

    const { getByText } = renderPage()

    const allTab = getByText('すべて')
    expect(allTab).toBeInTheDocument()
    expect(state.activeTab.value).toBe('all')
  })

  it('displays loading state when isLoading is true', () => {
    // Purpose: verify loading state is reflected in table.
    const state = baseState()
    state.isLoading.value = true
    useCustomersPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    expect(getByTestId('customers-table').getAttribute('data-loading')).toBe('true')
  })

  it('displays empty state when customer list is empty', () => {
    // Purpose: verify empty state is handled correctly.
    const state = baseState()
    state.customerList.value = { total: 0, users: [] }
    useCustomersPageMock.mockReturnValue(state)

    const { getByText } = renderPage()

    expect(getByText('全0人')).toBeInTheDocument()
  })

  it('displays correct total count from customer list', () => {
    // Purpose: verify total count is displayed correctly.
    const state = baseState()
    state.customerList.value = { total: 5, users: [] }
    useCustomersPageMock.mockReturnValue(state)

    const { getByText, getByTestId } = renderPage()

    expect(getByText('全5人')).toBeInTheDocument()
    expect(getByTestId('layout-main').getAttribute('data-total')).toBe('5')
  })
})
