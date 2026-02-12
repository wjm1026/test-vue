// generated-by: ai-assist v1.0
// type: unit
// description: AccountCreatePage wiring test ensuring layout title, form props, and submission handling.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { defineComponent, h, ref } from 'vue'

import AccountCreatePage from '@/views/accounts/create/AccountCreatePage.vue'

const useAccountCreatePageMock = vi.hoisted(() => vi.fn())

vi.mock('@/views/accounts/create/useAccountCreatePage', () => ({
  useAccountCreatePage: useAccountCreatePageMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: { title: { type: String, default: '' } },
  setup(props, { slots }) {
    return () =>
      h('section', { 'data-testid': 'layout', 'data-title': props.title }, slots.default?.())
  },
})

const AccountsFormStub = defineComponent({
  name: 'AccountsForm',
  props: {
    accountDetail: { type: Object, default: () => ({}) },
  },
  emits: ['successAccountSubmit'],
  setup(props, { emit }) {
    return () =>
      h('div', { 'data-testid': 'accounts-form', 'data-name': props.accountDetail?.name ?? '' }, [
        h(
          'button',
          {
            type: 'button',
            'data-testid': 'submit',
            onClick: () => emit('successAccountSubmit'),
          },
          'submit',
        ),
      ])
  },
})

const CreateAccountDialogStub = defineComponent({
  name: 'CreateAccountDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    account: { type: Object, default: () => ({}) },
  },
  emits: ['update:modelValue', 'closeDialog'],
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'create-account-dialog',
        'data-open': props.modelValue ? 'true' : 'false',
        'data-account-name': props.account?.accountName ?? '',
      })
  },
})

const renderPage = () =>
  render(AccountCreatePage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        AccountsForm: AccountsFormStub,
        CreateAccountDialog: CreateAccountDialogStub,
      },
    },
  })

describe('AccountCreatePage.vue', () => {
  beforeEach(() => {
    useAccountCreatePageMock.mockReset()
  })

  it('renders layout title, forwards account detail, and handles successful submit', async () => {
    const pageTitle = ref('アカウント追加')
    const accountDetail = ref({ name: '山田太郎' })
    const handleSubmit = vi.fn()

    useAccountCreatePageMock.mockReturnValue({
      pageTitle,
      accountDetail,
      handleSubmit,
      isEdit: ref(false),
      createVisible: ref(false),
      createdAccount: ref({ accountName: '', email: '', roleDisplayName: '' }),
    })

    const { getByTestId } = renderPage()

    expect(getByTestId('layout').getAttribute('data-title')).toBe('アカウント追加')
    expect(getByTestId('accounts-form').getAttribute('data-name')).toBe('山田太郎')

    await fireEvent.click(getByTestId('submit'))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('displays success dialog when account is created successfully', async () => {
    // Purpose: verify success dialog appears with account information after creation.
    const pageTitle = ref('アカウント追加')
    const accountDetail = ref({ name: '山田太郎' })
    const handleSubmit = vi.fn()
    const createVisible = ref(true)
    const createdAccount = ref({
      accountName: '山田太郎',
      email: 'yamada@example.com',
      roleDisplayName: '管理者',
    })

    useAccountCreatePageMock.mockReturnValue({
      pageTitle,
      accountDetail,
      handleSubmit,
      isEdit: ref(false),
      createVisible,
      createdAccount,
    })

    const { getByTestId } = renderPage()

    const dialog = getByTestId('create-account-dialog')
    expect(dialog.getAttribute('data-open')).toBe('true')
    expect(dialog.getAttribute('data-account-name')).toBe('山田太郎')
  })

  it('hides success dialog when createVisible is false', async () => {
    // Purpose: verify dialog is hidden when createVisible is false.
    const pageTitle = ref('アカウント追加')
    const accountDetail = ref({ name: '山田太郎' })
    const handleSubmit = vi.fn()
    const createVisible = ref(false)
    const createdAccount = ref({
      accountName: '山田太郎',
      email: 'yamada@example.com',
      roleDisplayName: '管理者',
    })

    useAccountCreatePageMock.mockReturnValue({
      pageTitle,
      accountDetail,
      handleSubmit,
      isEdit: ref(false),
      createVisible,
      createdAccount,
    })

    const { getByTestId } = renderPage()

    const dialog = getByTestId('create-account-dialog')
    expect(dialog.getAttribute('data-open')).toBe('false')
  })
})
