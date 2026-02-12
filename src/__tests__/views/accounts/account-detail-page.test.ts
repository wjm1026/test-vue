// generated-by: ai-assist v1.0
// type: unit
// description: AccountDetailPage view tests validating detail rendering, icon state, and button interactions.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { defineComponent, h, nextTick, ref } from 'vue'

import AccountDetailPage from '@/views/accounts/detail/AccountDetailPage.vue'

const useAccountDetailPageMock = vi.hoisted(() => vi.fn())

vi.mock('@/views/accounts/detail/useAccountDetailPage', () => ({
  useAccountDetailPage: useAccountDetailPageMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  setup(_, { slots }) {
    return () => h('section', { 'data-testid': 'layout' }, slots.default?.())
  },
})

const ElTextStub = defineComponent({
  name: 'ElText',
  setup(_, { slots }) {
    return () => h('p', slots.default ? slots.default() : [])
  },
})

const iconStub = (testId: string) =>
  defineComponent({
    name: `${testId}-icon`,
    setup() {
      return () => h('span', { 'data-testid': testId })
    },
  })

const SuccessIconStub = iconStub('success-icon')
const ErrorIconStub = iconStub('error-icon')
const PendingIconStub = iconStub('pending-icon')

const WhiteButtonStub = defineComponent({
  name: 'WhiteButton',
  props: {
    label: { type: String, default: '' },
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': `action-${props.label}`,
          onClick: () => emit('click'),
        },
        props.label,
      )
  },
})

const WithDeleteConfirmStub = defineComponent({
  name: 'WithDeleteConfirm',
  props: {
    title: { type: String, default: '' },
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
          slots.default ? h('div', { 'data-testid': 'confirm-slot' }, slots.default()) : null,
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'with-delete-confirm-button',
              onClick: () => emit('confirm'),
            },
            'confirm',
          ),
        ],
      )
  },
})

const renderPage = () =>
  render(AccountDetailPage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        ElText: ElTextStub,
        SuccessIcon: SuccessIconStub,
        ErrorIcon: ErrorIconStub,
        PendingIcon: PendingIconStub,
        WhiteButton: WhiteButtonStub,
        WithDeleteConfirm: WithDeleteConfirmStub,
      },
    },
  })

describe('AccountDetailPage.vue', () => {
  beforeEach(() => {
    useAccountDetailPageMock.mockReset()
  })

  it('renders account info and triggers action handlers', async () => {
    const accountDetail = ref<{
      accountId: number
      accountName: string
      email: string
      statusCode: string
      statusDisplayName: string
      password?: string
      roleId?: number
      roleDisplayName?: string
    }>({
      accountId: 1,
      accountName: '山田太郎',
      email: 'yamada@example.com',
      statusCode: '00',
      statusDisplayName: '有効',
    })
    const accountInfo = ref([
      { label: '氏名', value: '山田太郎' },
      { label: 'メールアドレス', value: 'yamada@example.com' },
      { label: 'ロール', value: 'ADMIN' },
    ])
    const isLoading = ref(false)
    const accountStatusActionLabel = ref('利用停止する')
    const handleEdit = vi.fn()
    const handleUpdateAccountStatus = vi.fn()
    const handleDelete = vi.fn()
    const isDeleteLoading = ref(false)
    const isStatusLoading = ref(false)

    useAccountDetailPageMock.mockReturnValue({
      accountDetail,
      isLoading,
      accountInfo,
      accountStatusActionLabel,
      handleEdit,
      handleUpdateAccountStatus,
      handleDelete,
      isDeleteLoading,
      isStatusLoading,
    })

    const { getAllByText, getByText, queryByTestId, getByTestId } = renderPage()

    expect(getAllByText('山田太郎').length).toBeGreaterThan(0)
    expect(queryByTestId('success-icon')).toBeInTheDocument()
    expect(queryByTestId('error-icon')).not.toBeInTheDocument()
    expect(queryByTestId('pending-icon')).not.toBeInTheDocument()

    expect(getByText('氏名')).toBeInTheDocument()
    expect(getAllByText('yamada@example.com').length).toBeGreaterThan(0)

    await fireEvent.click(getByTestId('action-編集する'))
    expect(handleEdit).toHaveBeenCalledTimes(1)
    await fireEvent.click(getByTestId('action-利用停止する'))
    const statusConfirmButton = document.querySelector(
      '[data-testid="with-delete-confirm"][data-title=""] [data-testid="with-delete-confirm-button"]',
    ) as HTMLElement
    await fireEvent.click(statusConfirmButton)
    expect(handleUpdateAccountStatus).toHaveBeenCalledTimes(1)
    expect(
      document
        .querySelector('[data-testid="with-delete-confirm"][data-title="アカウントを削除します"]')
        ?.getAttribute('data-title'),
    ).toBe('アカウントを削除します')
    expect(
      document
        .querySelector('[data-testid="with-delete-confirm"][data-title="アカウントを削除します"]')
        ?.getAttribute('data-loading'),
    ).toBe('false')
    const deleteConfirmButton = document.querySelector(
      '[data-testid="with-delete-confirm"][data-title="アカウントを削除します"] [data-testid="with-delete-confirm-button"]',
    ) as HTMLElement
    await fireEvent.click(deleteConfirmButton)
    expect(handleDelete).toHaveBeenCalledTimes(1)
  })

  it('shows fallback icons for non-active statuses', async () => {
    const accountDetail = ref<{
      accountId: number
      accountName: string
      email: string
      statusCode: string
      statusDisplayName: string
      password?: string
      roleId?: number
      roleDisplayName?: string
    }>({
      accountId: 2,
      accountName: '木村花子',
      email: 'kimura@example.com',
      statusCode: '01',
      statusDisplayName: '無効',
    })
    const accountInfo = ref([])
    const isLoading = ref(false)
    const accountStatusActionLabel = ref('有効にする')
    const handleEdit = vi.fn()
    const handleAccountStatus = vi.fn()
    const handleDelete = vi.fn()
    const isDeleteLoading = ref(true)
    const isStatusLoading = ref(true)

    useAccountDetailPageMock.mockReturnValue({
      accountDetail,
      isLoading,
      accountInfo,
      accountStatusActionLabel,
      handleEdit,
      handleAccountStatus,
      handleDelete,
      isDeleteLoading,
      isStatusLoading,
    })

    const { queryByTestId } = renderPage()
    expect(queryByTestId('error-icon')).toBeInTheDocument()
    expect(queryByTestId('pending-icon')).not.toBeInTheDocument()

    accountDetail.value = {
      accountId: 3,
      accountName: '佐藤次郎',
      email: 'sato@example.com',
      password: 'password123',
      roleId: 1,
      roleDisplayName: 'ADMIN',
      statusCode: '02',
      statusDisplayName: '招待中',
    }

    await nextTick()
    expect(queryByTestId('error-icon')).not.toBeInTheDocument()
    expect(queryByTestId('pending-icon')).toBeInTheDocument()
    expect(
      document
        .querySelector('[data-testid="with-delete-confirm"][data-title=""]')
        ?.getAttribute('data-loading'),
    ).toBe('true')
  })
})
