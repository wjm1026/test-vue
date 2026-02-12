// generated-by: ai-assist v1.0
// type: unit
// description: CustomerDetailPage tests covering layout rendering, customer info display, comment list, and user interactions.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { defineComponent, h, ref } from 'vue'

import CustomerDetailPage from '@/views/customers/CustomerDetailPage.vue'

const useCustomerDetailPageMock = vi.hoisted(() => vi.fn())

vi.mock('@/views/customers/useCustomerDetailPage', () => ({
  useCustomerDetailPage: useCustomerDetailPageMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: {
    total: { type: Number, default: 0 },
    showPagination: { type: Boolean, default: false },
    page: { type: Number, default: 1 },
    showEmpty: { type: Boolean, default: false },
  },
  emits: ['page-change'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'section',
        {
          'data-testid': 'layout-main',
          'data-total': String(props.total),
          'data-page': String(props.page),
          'data-show-empty': String(props.showEmpty),
        },
        [
          slots.title ? h('div', { 'data-testid': 'layout-title' }, slots.title()) : null,
          slots.default ? slots.default() : null,
          slots['pagination-left']
            ? h('div', { 'data-testid': 'pagination-left' }, slots['pagination-left']())
            : null,
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

const StatusLabelStub = defineComponent({
  name: 'StatusLabel',
  props: {
    status: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h('span', {
        'data-testid': 'status-label',
        'data-status': props.status,
      })
  },
})

const ElTextStub = defineComponent({
  name: 'ElText',
  props: {
    class: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'span',
        { 'data-testid': 'el-text', class: props.class },
        slots.default ? slots.default() : [],
      )
  },
})

const WhiteButtonStub = defineComponent({
  name: 'WhiteButton',
  props: {
    label: { type: String, required: true },
    className: { type: String, default: '' },
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          'data-testid': `white-button-${props.label}`,
          class: props.className,
          onClick: () => emit('click'),
        },
        props.label,
      )
  },
})

const CustomerInfoCardStub = defineComponent({
  name: 'CustomerInfoCard',
  props: {
    customer: { type: Object, required: true },
    isLoading: { type: Boolean, default: false },
  },
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'customer-info-card',
        'data-user-id': props.customer?.userId,
        'data-loading': String(props.isLoading),
      })
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

const CustomerCommentsTableStub = defineComponent({
  name: 'CustomerCommentsTable',
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
        'data-testid': 'customer-comments-table',
        'data-row-count': String(props.data?.length || 0),
        'data-loading': String(props.isLoading),
        'data-sort-field': props.sortField,
        'data-sort-order': props.sortOrder,
      })
  },
})

const loadingDirective = vi.fn()

const baseState = () => {
  const pageChange = vi.fn()
  const handleHideAllComments = vi.fn()
  return {
    customerDetail: ref({
      userId: 'C-123',
      nickname: 'テストユーザー',
      status: 'active',
      ageGroup: '30代',
      gender: '男性',
      totalReviews: 50,
      totalLikes: 1200,
    }),
    commentList: ref({
      totalCount: 25,
      comments: [
        { reviewId: 'R-1', comment: 'コメント1', createdAt: '2024-01-01', projectId: 'P-1' },
        { reviewId: 'R-2', comment: 'コメント2', createdAt: '2024-01-02', projectId: 'P-2' },
      ],
    }),
    isLoading: ref(false),
    isEmpty: ref(false),
    page: ref(1),
    searchKeyword: ref(''),
    activeTab: ref('all'),
    sortField: ref('reviewId'),
    sortOrder: ref('desc'),
    pageChange,
    handleHideAllComments,
    tabs: [
      { label: 'すべて', name: 'all' },
      { label: '非表示コメント', name: 'hidden' },
    ],
  }
}

const renderPage = () =>
  render(CustomerDetailPage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        StatusLabel: StatusLabelStub,
        ElText: ElTextStub,
        WhiteButton: WhiteButtonStub,
        CustomerInfoCard: CustomerInfoCardStub,
        SearchInput: SearchInputStub,
        CustomerCommentsTable: CustomerCommentsTableStub,
      },
      directives: {
        loading: loadingDirective,
      },
    },
  })

describe('CustomerDetailPage', () => {
  beforeEach(() => {
    vi.resetModules()
    useCustomerDetailPageMock.mockReset()
    loadingDirective.mockReset()
  })

  it('renders layout with customer detail title, info card, and comment list', () => {
    // Purpose: verify page renders customer information and comment list from composable state.
    useCustomerDetailPageMock.mockReturnValue(baseState())

    const { getByTestId, getByText } = renderPage()

    expect(getByTestId('layout-main').getAttribute('data-total')).toBe('25')
    expect(getByTestId('layout-main').getAttribute('data-page')).toBe('1')
    expect(getByTestId('status-label').getAttribute('data-status')).toBe('active')
    expect(getByText('テストユーザー（ID：C-123）')).toBeInTheDocument()
    expect(getByTestId('customer-info-card').getAttribute('data-user-id')).toBe('C-123')
    expect(getByText('コメント一覧')).toBeInTheDocument()
    expect(getByText('全25件')).toBeInTheDocument()
    expect(getByTestId('customer-comments-table').getAttribute('data-row-count')).toBe('2')
  })

  it('renders hide all comments button and handles click', async () => {
    // Purpose: ensure hide all comments button triggers composable handler.
    const state = baseState()
    useCustomerDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    const hideButton = getByTestId('white-button-全てのコメントを非表示にする')
    expect(hideButton).toBeInTheDocument()
    await fireEvent.click(hideButton)
    expect(state.handleHideAllComments).toHaveBeenCalledTimes(1)
  })

  it('renders search input with correct placeholder and binds to searchKeyword', () => {
    // Purpose: verify search input is rendered and bound to composable state.
    const state = baseState()
    state.searchKeyword.value = 'test query'
    useCustomerDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    const searchInput = getByTestId('search-input') as HTMLInputElement
    expect(searchInput.getAttribute('placeholder')).toBe('コメントID、ワード、プロジェクトIDで検索')
    expect(searchInput.value).toBe('test query')
  })

  it('renders tabs and allows switching between active and hidden comments', async () => {
    // Purpose: verify tab buttons render and update activeTab when clicked.
    const state = baseState()
    useCustomerDetailPageMock.mockReturnValue(state)

    const { getByText } = renderPage()

    const allTab = getByText('すべて')
    const hiddenTab = getByText('非表示コメント')

    expect(allTab).toBeInTheDocument()
    expect(hiddenTab).toBeInTheDocument()

    await fireEvent.click(hiddenTab)
    expect(state.activeTab.value).toBe('hidden')

    await fireEvent.click(allTab)
    expect(state.activeTab.value).toBe('all')
  })

  it('invokes pageChange when pagination emits event', async () => {
    // Purpose: ensure pagination change triggers composable pageChange handler.
    const state = baseState()
    useCustomerDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    await fireEvent.click(getByTestId('layout-page-button'))
    expect(state.pageChange).toHaveBeenCalledWith(2)
  })

  it('shows empty state when isEmpty is true and not loading', () => {
    // Purpose: verify empty state is displayed when there is no customer data.
    const state = baseState()
    state.isEmpty.value = true
    state.isLoading.value = false
    useCustomerDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    expect(getByTestId('layout-main').getAttribute('data-show-empty')).toBe('true')
  })

  it('does not show empty state when loading', () => {
    // Purpose: verify empty state is hidden during loading.
    const state = baseState()
    state.isEmpty.value = true
    state.isLoading.value = true
    useCustomerDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    expect(getByTestId('layout-main').getAttribute('data-show-empty')).toBe('false')
  })

  it('renders customer info card only when customerDetail exists', () => {
    // Purpose: verify CustomerInfoCard is conditionally rendered based on customerDetail.
    const state = baseState()
    state.customerDetail.value = null as unknown as typeof state.customerDetail.value
    useCustomerDetailPageMock.mockReturnValue(state)

    const { queryByTestId } = renderPage()

    expect(queryByTestId('customer-info-card')).not.toBeInTheDocument()
  })

  it('passes sortField and sortOrder to CustomerCommentsTable', () => {
    // Purpose: verify sorting state is passed to comments table component.
    const state = baseState()
    state.sortField.value = 'createdAt'
    state.sortOrder.value = 'asc'
    useCustomerDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    const table = getByTestId('customer-comments-table')
    expect(table.getAttribute('data-sort-field')).toBe('createdAt')
    expect(table.getAttribute('data-sort-order')).toBe('asc')
  })
})
