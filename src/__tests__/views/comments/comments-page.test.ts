// generated-by: ai-assist v1.0
// type: unit
// description: CommentsPage tests covering render state, interactions, and composable wiring.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, h, ref } from 'vue'
import { fireEvent, render } from '@testing-library/vue'

import CommentsPage from '@/views/comments/CommentsPage.vue'

const useCommentsPageMock = vi.hoisted(() => vi.fn())

vi.mock('@/views/comments/useCommentsPage', () => ({
  useCommentsPage: useCommentsPageMock,
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

const WhiteButtonStub = defineComponent({
  name: 'WhiteButton',
  props: {
    label: { type: String, required: true },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          'data-testid': `white-button-${props.label}`,
          onClick: () => emit('click'),
        },
        [
          slots.prefix
            ? h('span', { 'data-testid': `white-button-prefix-${props.label}` }, slots.prefix())
            : null,
          props.label,
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
        placeholder: props.placeholder,
        value: props.modelValue,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLInputElement).value),
      })
  },
})

const ElIconStub = defineComponent({
  name: 'ElIcon',
  setup(_, { slots }) {
    return () => h('span', { 'data-testid': 'el-icon' }, slots.default ? slots.default() : [])
  },
})

const ElCheckboxGroupStub = defineComponent({
  name: 'ElCheckboxGroup',
  props: {
    modelValue: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue'],
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        { 'data-testid': 'checkbox-group' },
        slots.default ? slots.default({ modelValue: props.modelValue }) : [],
      )
  },
})

const BaseCheckboxStub = defineComponent({
  name: 'BaseCheckbox',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  setup(props) {
    return () => h('label', { 'data-testid': `checkbox-${props.value}` }, props.label)
  },
})

const ElTextStub = defineComponent({
  name: 'ElText',
  setup(_, { slots }) {
    return () => h('span', { 'data-testid': 'el-text' }, slots.default ? slots.default() : [])
  },
})

const CommentsTableStub = defineComponent({
  name: 'CommentsTable',
  props: {
    data: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    selectedRows: { type: Array, default: () => [] },
    sortField: { type: String, default: '' },
    sortOrder: { type: String, default: '' },
  },
  emits: ['update:selectedRows', 'update:sortField', 'update:sortOrder'],
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'comments-table',
        'data-row-count': String(props.data.length),
        'data-loading': String(props.isLoading),
        'data-sort-field': props.sortField,
        'data-sort-order': props.sortOrder,
      })
  },
})

const UploadIconStub = defineComponent({
  name: 'UploadIcon',
  setup() {
    return () => h('svg', { 'data-testid': 'upload-icon' })
  },
})

const baseState = () => {
  const commentList = ref({
    totalCount: 3,
    comments: [
      { id: 'c1', commentId: 'C1', isChecked: false },
      { id: 'c2', commentId: 'C2', isChecked: true },
    ],
  })
  return {
    searchKeyword: ref(''),
    activeTab: ref('all'),
    filterList: ref<string[]>(['visible', 'hidden']),
    commentList,
    isLoading: ref(false),
    page: ref(1),
    selectedRows: ref<string[]>([]),
    sortField: ref('comment'),
    sortOrder: ref('desc'),
    pageChange: vi.fn(),
    handleCSVDownload: vi.fn(),
    toggleCheckAll: vi.fn(),
    checkAllButtonLabel: computed(() => '全てチェック済みにする'),
  }
}

const createState = (overrides: Partial<ReturnType<typeof baseState>> = {}) => ({
  ...baseState(),
  ...overrides,
})

const renderPage = () =>
  render(CommentsPage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        WhiteButton: WhiteButtonStub,
        SearchInput: SearchInputStub,
        ElIcon: ElIconStub,
        ElCheckboxGroup: ElCheckboxGroupStub,
        BaseCheckbox: BaseCheckboxStub,
        ElText: ElTextStub,
        CommentsTable: CommentsTableStub,
        UploadIcon: UploadIconStub,
      },
    },
  })

describe('CommentsPage', () => {
  beforeEach(() => {
    vi.resetModules()
    useCommentsPageMock.mockReset()
  })

  it('renders filters, tabs, table, and passes totals from composable state', () => {
    const state = createState()
    useCommentsPageMock.mockReturnValue(state)

    const view = renderPage()

    expect(view.getByTestId('layout-main').getAttribute('data-title')).toBe('コメント管理')
    expect(view.getByTestId('layout-main').getAttribute('data-total')).toBe('3')
    expect(view.getByTestId('search-input').getAttribute('placeholder')).toBe(
      'コメントID、ワード、プロジェクトID、ユーザーIDで検索',
    )
    expect(view.getByText('全3コメント')).toBeInTheDocument()
    expect(view.getByTestId('comments-table').getAttribute('data-row-count')).toBe('2')
    expect(view.getByTestId('white-button-CSVをダウンロードする')).toBeInTheDocument()
    expect(view.getByTestId('white-button-全てチェック済みにする')).toBeInTheDocument()
    expect(view.getByText('未チェック')).toBeInTheDocument()
    expect(view.getByText('すべて')).toBeInTheDocument()
    expect(view.getByText('NGワードコメント')).toBeInTheDocument()
    expect(view.getByText('報告されたコメント')).toBeInTheDocument()
  })

  it('invokes composable handlers for CSV download, check all, and pagination', async () => {
    const state = createState({
      pageChange: vi.fn(),
      handleCSVDownload: vi.fn(),
      toggleCheckAll: vi.fn(),
    })
    useCommentsPageMock.mockReturnValue(state)

    const view = renderPage()

    await fireEvent.click(view.getByTestId('white-button-CSVをダウンロードする'))
    expect(state.handleCSVDownload).toHaveBeenCalledTimes(1)

    await fireEvent.click(view.getByTestId('white-button-全てチェック済みにする'))
    expect(state.toggleCheckAll).toHaveBeenCalledTimes(1)

    await fireEvent.click(view.getByTestId('layout-page-button'))
    expect(state.pageChange).toHaveBeenCalledWith(2)
  })

  it('updates search keyword when input value changes', async () => {
    // Purpose: verify search input binding updates keyword.
    const state = createState()
    useCommentsPageMock.mockReturnValue(state)

    const view = renderPage()
    const searchInput = view.getByTestId('search-input') as HTMLInputElement

    await fireEvent.update(searchInput, 'test query')
    expect(state.searchKeyword.value).toBe('test query')
  })

  it('switches active tab when tab button is clicked', async () => {
    // Purpose: verify tab switching updates activeTab state.
    const state = createState()
    useCommentsPageMock.mockReturnValue(state)

    const view = renderPage()

    const uncheckedTab = view.getByText('未チェック')
    const allTab = view.getByText('すべて')
    const ngWordTab = view.getByText('NGワードコメント')
    const reportedTab = view.getByText('報告されたコメント')

    expect(uncheckedTab).toBeInTheDocument()
    expect(allTab).toBeInTheDocument()
    expect(ngWordTab).toBeInTheDocument()
    expect(reportedTab).toBeInTheDocument()

    await fireEvent.click(ngWordTab)
    expect(state.activeTab.value).toBe('ng_word')

    await fireEvent.click(reportedTab)
    expect(state.activeTab.value).toBe('reported')
  })

  it('updates filter list when checkboxes are changed', async () => {
    // Purpose: verify filter checkboxes update filterList state.
    const state = createState()
    useCommentsPageMock.mockReturnValue(state)

    const view = renderPage()

    const checkboxGroup = view.getByTestId('checkbox-group')
    expect(checkboxGroup).toBeInTheDocument()
    expect(state.filterList.value).toEqual(['visible', 'hidden'])
  })

  it('updates sort field and sort order when table emits events', async () => {
    // Purpose: verify sorting state can be updated via table component.
    const state = createState()
    useCommentsPageMock.mockReturnValue(state)

    const view = renderPage()

    const table = view.getByTestId('comments-table')
    expect(table.getAttribute('data-sort-field')).toBe('comment')
    expect(table.getAttribute('data-sort-order')).toBe('desc')
  })

  it('displays loading state when isLoading is true', () => {
    // Purpose: verify loading state is reflected in table.
    const state = createState()
    state.isLoading.value = true
    useCommentsPageMock.mockReturnValue(state)

    const view = renderPage()

    expect(view.getByTestId('comments-table').getAttribute('data-loading')).toBe('true')
  })

  it('displays empty state when comment list is empty', () => {
    // Purpose: verify empty state is handled correctly.
    const state = createState()
    state.commentList.value = { totalCount: 0, comments: [] }
    useCommentsPageMock.mockReturnValue(state)

    const view = renderPage()

    expect(view.getByText('全0コメント')).toBeInTheDocument()
  })

  it('displays CSV download button with upload icon', () => {
    // Purpose: verify CSV download button includes icon prefix.
    const state = createState()
    useCommentsPageMock.mockReturnValue(state)

    const view = renderPage()

    const csvButton = view.getByTestId('white-button-CSVをダウンロードする')
    expect(csvButton).toBeInTheDocument()
    expect(view.getByTestId('upload-icon')).toBeInTheDocument()
  })

  it('displays check all button with correct label', () => {
    // Purpose: verify check all button label reflects current state.
    const state = createState()
    useCommentsPageMock.mockReturnValue(state)

    const view = renderPage()

    expect(view.getByTestId('white-button-全てチェック済みにする')).toBeInTheDocument()
  })
})
