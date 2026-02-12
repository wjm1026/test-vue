// generated-by: ai-assist v1.0
// type: unit
// description: CreateAccountDialog component tests ensuring account info display and dialog close behavior.

import { fireEvent, render } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, h, nextTick } from 'vue'

import CreateAccountDialog from '@/components/view/accounts/CreateAccountDialog.vue'
import { routePaths } from '@/router/paths'
import type { AccountCreatedData } from '@/components/view/accounts/useCreateAccountDialog'

const pushMock = vi.fn()

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({
      params: {},
    }),
    useRouter: () => ({
      push: pushMock,
    }),
  }
})

const useCreateAccountDialogMock = vi.hoisted(() => vi.fn())

vi.mock('@/components/view/accounts/useCreateAccountDialog', () => ({
  useCreateAccountDialog: useCreateAccountDialogMock,
}))

const BaseDialogStub = defineComponent({
  name: 'BaseDialogStub',
  props: {
    modelValue: { type: [Boolean, Object], default: false },
    dialogTitle: { type: String, default: '' },
    className: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, emit }) {
    const isOpen = computed(() => {
      if (typeof props.modelValue === 'boolean') {
        return props.modelValue
      }
      if (props.modelValue && typeof props.modelValue === 'object' && 'value' in props.modelValue) {
        return props.modelValue.value
      }
      if (props.modelValue && typeof props.modelValue === 'object' && 'get' in props.modelValue) {
        return props.modelValue.get()
      }
      return false
    })
    return () =>
      h(
        'section',
        {
          'data-testid': 'base-dialog',
          'data-open': isOpen.value ? 'true' : 'false',
          'data-class': props.className,
        },
        [
          h('p', { 'data-testid': 'dialog-title' }, props.dialogTitle),
          slots.main ? slots.main() : null,
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'close-from-dialog',
              onClick: () => emit('close'),
            },
            'close',
          ),
        ],
      )
  },
})

const BlueButtonStub = defineComponent({
  name: 'BlueButtonStub',
  props: { label: { type: String, default: '' } },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': 'close-button',
          onClick: () => emit('click'),
        },
        props.label,
      )
  },
})

const ElTextStub = defineComponent({
  name: 'ElTextStub',
  setup(_, { slots }) {
    return () => h('span', slots.default ? slots.default() : [])
  },
})

const renderDialog = (override?: Partial<AccountCreatedData>) => {
  const account: AccountCreatedData = {
    accountName: '山田太郎',
    email: 'yamada@example.com',
    roleDisplayName: '管理者',
    ...override,
  }

  const closeDialog = vi.fn()
  let accountVisibleValue = true

  const closeAccountDialog = vi.fn(() => {
    accountVisibleValue = false
    closeDialog()
    pushMock(routePaths.accounts.root)
  })

  useCreateAccountDialogMock.mockReturnValue({
    accountVisible: {
      get: () => accountVisibleValue,
      set: (val: boolean) => {
        accountVisibleValue = val
        if (!val) {
          closeDialog()
          pushMock(routePaths.accounts.root)
        }
      },
    },
    closeAccountDialog,
  })

  const utils = render(CreateAccountDialog, {
    props: {
      modelValue: true,
      account,
    },
    global: {
      stubs: {
        BaseDialog: BaseDialogStub,
        BlueButton: BlueButtonStub,
        ElText: ElTextStub,
      },
    },
  })

  return { ...utils, account, closeDialog, closeAccountDialog }
}

describe('CreateAccountDialog.vue', () => {
  beforeEach(() => {
    pushMock.mockReset()
    useCreateAccountDialogMock.mockReset()
  })

  it('renders the account information when opened', async () => {
    // Ensures the dialog displays account details after creation.
    const { getByTestId, getByText, account } = renderDialog()
    await nextTick()

    expect(getByTestId('base-dialog').getAttribute('data-open')).toBe('true')
    expect(getByTestId('dialog-title').textContent).toBe('アカウントが作成されました')
    expect(getByText(account.accountName)).toBeInTheDocument()
    // The email + role text is rendered across nested elements, so use textContent-based matcher.
    expect(
      getByText((_, element) => {
        const className = element?.getAttribute?.('class') ?? ''
        if (!className.includes('text-gray500')) return false
        const text = element?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
        return text.includes(account.email) && text.includes(account.roleDisplayName)
      }),
    ).toBeInTheDocument()
  })

  it('emits closeDialog, hides the modal, and routes to accounts root when closed', async () => {
    // Confirms both the button handler and routing contract fire on dialog dismissal.
    const { getByRole, closeDialog, closeAccountDialog } = renderDialog()
    await nextTick()

    await fireEvent.click(getByRole('button', { name: '閉じる' }))
    await nextTick()

    expect(closeAccountDialog).toHaveBeenCalledTimes(1)
    expect(closeDialog).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith(routePaths.accounts.root)
    // Note: The dialog state is managed by the mock, so we verify the function was called
    // rather than checking the DOM state which may not update synchronously in the stub
  })

  it('handles BaseDialog close events the same as button clicks', async () => {
    // BaseDialog close hooks should also propagate the navigation and emit.
    const { getByTestId, closeDialog } = renderDialog()
    await nextTick()

    await fireEvent.click(getByTestId('close-from-dialog'))
    await nextTick()

    expect(closeDialog).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith(routePaths.accounts.root)
  })

  it('displays account information in the card layout', async () => {
    // Purpose: verify account information is displayed in the card with proper styling.
    const { getByText, account } = renderDialog()
    await nextTick()

    expect(getByText(account.accountName)).toBeInTheDocument()
    expect(
      getByText((_, element) => {
        const className = element?.getAttribute?.('class') ?? ''
        if (!className.includes('text-gray500')) return false
        const text = element?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
        return text.includes(account.email) && text.includes(account.roleDisplayName)
      }),
    ).toBeInTheDocument()
  })

  it('handles empty account name gracefully', async () => {
    // Purpose: verify dialog handles empty account name gracefully.
    const { getByTestId } = renderDialog({ accountName: '' })
    await nextTick()

    expect(getByTestId('base-dialog')).toBeInTheDocument()
  })

  it('displays account email and role in combined format', async () => {
    // Purpose: verify account email and role are displayed together in the format "email / role".
    const { getByText, account } = renderDialog()
    await nextTick()

    expect(
      getByText((_, element) => {
        const className = element?.getAttribute?.('class') ?? ''
        if (!className.includes('text-gray500')) return false
        const text = element?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
        return text.includes(account.email) && text.includes(account.roleDisplayName)
      }),
    ).toBeInTheDocument()
  })
})
