// generated-by: ai-assist v1.0
// type: unit
// description: AccountsPage layout rendering, bindings, and interaction coverage.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { defineComponent, h, ref } from 'vue'

import AccountsPage from '@/views/accounts/AccountsPage.vue'
import { SortOrder } from '@/enum'

const useAccountsPageMock = vi.hoisted(() => vi.fn())

vi.mock('@/views/accounts/useAccountsPage', () => ({
  useAccountsPage: useAccountsPageMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: {
    title: { type: String, default: '' },
    total: { type: Number, default: 0 },
    showPagination: { type: Boolean, default: false },
    page: { type: Number, default: 1 },
  },
  emits: ['page-change'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'section',
        {
          'data-testid': 'layout',
          'data-title': props.title,
          'data-total': String(props.total),
          'data-page': String(props.page),
          'data-pagination': props.showPagination ? 'true' : 'false',
        },
        [
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'next-page',
              onClick: () => emit('page-change', (props.page ?? 1) + 1),
            },
            'next',
          ),
          slots.default ? slots.default() : null,
        ],
      )
  },
})

const AddButtonStub = defineComponent({
  name: 'AddButton',
  props: { label: { type: String, default: '' } },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        { type: 'button', 'data-testid': 'add-button', onClick: () => emit('click') },
        props.label,
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
    return () => h('p', { 'data-testid': 'count' }, slots.default ? slots.default() : undefined)
  },
})

const AccountsTableStub = defineComponent({
  name: 'AccountsTable',
  props: {
    data: { type: Array as () => Array<Record<string, unknown>>, default: () => [] },
    isLoading: { type: Boolean, default: false },
    sortField: { type: String, default: '' },
    sortOrder: { type: String, default: '' },
  },
  emits: ['update:sortField', 'update:sortOrder'],
  setup(props, { emit }) {
    return () =>
      h('section', { 'data-testid': 'table', 'data-loading': props.isLoading ? 'true' : 'false' }, [
        h('span', (props.data?.[0]?.name as string) ?? ''),
        h(
          'button',
          {
            type: 'button',
            'data-testid': 'sort-name',
            onClick: () => {
              emit('update:sortField', 'name')
              emit('update:sortOrder', SortOrder.Desc)
            },
          },
          'sort',
        ),
      ])
  },
})

const renderAccountsPage = () =>
  render(AccountsPage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        AddButton: AddButtonStub,
        SearchInput: SearchInputStub,
        AccountsTable: AccountsTableStub,
        ElText: ElTextStub,
      },
    },
  })

describe('AccountsPage.vue', () => {
  beforeEach(() => {
    useAccountsPageMock.mockReset()
  })

  it('renders account summary and wires search, pagination, and sorting', async () => {
    // Purpose: ensure LayoutMain receives totals and content from the composable.
    const page = ref(1)
    const searchKeyword = ref('')
    const sortField = ref('')
    const sortOrder = ref<SortOrder>(SortOrder.Asc)
    const isLoading = ref(false)
    const accountList = ref({
      total: 3,
      accounts: [{ name: '山田太郎' }],
    })
    const pageChange = vi.fn((newPage: number) => {
      page.value = newPage
    })
    const accountAdd = vi.fn()

    useAccountsPageMock.mockReturnValue({
      accountList,
      page,
      searchKeyword,
      sortField,
      sortOrder,
      isLoading,
      pageChange,
      accountAdd,
    })

    const { getByTestId, getByPlaceholderText } = renderAccountsPage()

    expect(getByTestId('layout').getAttribute('data-title')).toBe('アカウント管理')
    expect(getByTestId('layout').getAttribute('data-total')).toBe('3')
    expect(getByTestId('count').textContent).toContain('全3人')
    expect(getByTestId('table').textContent).toContain('山田太郎')

    // Assertion: search input v-model updates searchKeyword ref.
    const searchInput = getByPlaceholderText('氏名、メールアドレスで検索')
    await fireEvent.update(searchInput, '佐藤')
    expect(searchKeyword.value).toBe('佐藤')

    // Assertion: pagination emit triggers composable handler and updates page ref.
    await fireEvent.click(getByTestId('next-page'))
    expect(pageChange).toHaveBeenCalledWith(2)
    expect(page.value).toBe(2)

    // Assertion: clicking add button calls the accountAdd action.
    await fireEvent.click(getByTestId('add-button'))
    expect(accountAdd).toHaveBeenCalledTimes(1)

    // Assertion: sort interaction updates sort refs via v-model bindings.
    await fireEvent.click(getByTestId('sort-name'))
    expect(sortField.value).toBe('name')
    expect(sortOrder.value).toBe(SortOrder.Desc)
  })
})
