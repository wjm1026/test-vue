// generated-by: ai-assist v1.0
// type: unit
// description: AccountsForm component tests ensuring field bindings and action handlers.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { defineComponent, h, reactive, ref, nextTick } from 'vue'

import AccountsForm from '@/components/view/accounts/AccountsForm.vue'

const useAccountsFormMock = vi.hoisted(() => vi.fn())

vi.mock('@/components/view/accounts/useAccountsForm', () => ({
  useAccountsForm: useAccountsFormMock,
}))
const routerGo = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ go: routerGo }),
}))

const BaseFormStub = defineComponent({
  name: 'BaseForm',
  inheritAttrs: false,
  props: {
    model: { type: Object, default: () => ({}) },
    rules: { type: Object, default: () => ({}) },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'form',
        {
          ...attrs,
          'data-testid': 'base-form',
          'data-model-keys': Object.keys(props.model ?? {}).join(','),
          'data-has-rules': props.rules ? 'true' : 'false',
        },
        slots.default ? slots.default() : [],
      )
  },
})

const ElFormItemStub = defineComponent({
  name: 'ElFormItem',
  inheritAttrs: false,
  props: {
    label: { type: String, default: '' },
    prop: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'label',
        {
          'data-testid': 'form-item',
          'data-label': props.label,
          'data-prop': props.prop,
        },
        slots.default ? slots.default() : [],
      )
  },
})

const ElInputStub = defineComponent({
  name: 'ElInput',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        type: props.type,
        value: props.modelValue,
        placeholder: props.placeholder,
        'data-testid': `input-${props.placeholder}`,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLInputElement).value),
      })
  },
})

const ElSelectV2Stub = defineComponent({
  name: 'el-select-v2',
  props: {
    modelValue: { type: [String, Number], default: '' },
    options: { type: Array as () => Array<Record<string, unknown>>, default: () => [] },
    placeholder: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'select',
        {
          'data-testid': 'role-select',
          value: String(props.modelValue ?? ''),
          onChange: (event: Event) => {
            const value = (event.target as HTMLSelectElement).value
            // Convert to number if option value is number
            const option = props.options?.find((opt) => String(opt.roleId) === value)
            emit('update:modelValue', option ? option.roleId : value)
          },
        },
        [
          h('option', { value: '' }, props.placeholder),
          ...(props.options ?? []).map((option) =>
            h(
              'option',
              { value: String(option.roleId), 'data-testid': `role-${option.roleId}` },
              String(option.roleDisplayName),
            ),
          ),
        ],
      )
  },
})

const buttonStub = (testId: string) =>
  defineComponent({
    name: `${testId}-button`,
    props: {
      label: { type: String, default: '' },
      isLoading: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
    },
    emits: ['click'],
    setup(props, { emit }) {
      return () =>
        h(
          'button',
          {
            type: 'button',
            'data-testid': testId,
            disabled: props.disabled,
            'data-loading': props.isLoading ? 'true' : 'false',
            onClick: () => emit('click'),
          },
          props.label,
        )
    },
  })

const WhiteButtonStub = buttonStub('cancel-button')
const BlueButtonStub = buttonStub('submit-button')

const renderAccountsForm = () =>
  render(AccountsForm, {
    global: {
      stubs: {
        BaseForm: BaseFormStub,
        ElFormItem: ElFormItemStub,
        ElInput: ElInputStub,
        'el-select-v2': ElSelectV2Stub,
        WhiteButton: WhiteButtonStub,
        BlueButton: BlueButtonStub,
      },
    },
  })

describe('AccountsForm.vue', () => {
  beforeEach(() => {
    useAccountsFormMock.mockReset()
  })

  it('binds form inputs, select options, and triggers actions', async () => {
    const accountForm = reactive({
      accountId: undefined,
      accountName: '',
      email: '',
      password: '',
      roleId: undefined,
      roleDisplayName: '',
      statusCode: '',
      statusDisplayName: '',
    })
    const handleCancel = vi.fn()
    const handleSubmit = vi.fn()

    useAccountsFormMock.mockReturnValue({
      accountFormRef: ref(),
      accountForm,
      accountFormRules: {},
      submitLabel: ref('登録する'),
      handleCancel,
      handleSubmit,
      isSubmitPending: ref(false),
      disabled: ref(true),
      accountRoleList: ref({ roles: [{ roleId: 1, roleDisplayName: '管理者' }] }),
      isEdit: ref(false),
    })

    const { getByPlaceholderText, getByTestId } = renderAccountsForm()

    await fireEvent.update(getByPlaceholderText('氏名を入力'), '山田太郎')
    await fireEvent.update(getByPlaceholderText('sample@example.com'), 'yamada@example.com')

    const roleSelect = getByTestId('role-select') as HTMLSelectElement
    roleSelect.value = '1'
    await fireEvent.change(roleSelect)
    await nextTick()

    expect(accountForm.accountName).toBe('山田太郎')
    expect(accountForm.email).toBe('yamada@example.com')
    // Note: ElSelectV2Stub now converts string to number when option is found
    expect(accountForm.roleId).toBe(1)

    const submitButton = getByTestId('submit-button')
    expect(submitButton).toHaveTextContent('登録する')
    expect(submitButton).toBeDisabled()

    await fireEvent.click(getByTestId('cancel-button'))
    expect(routerGo).toHaveBeenCalledTimes(1)
    expect(routerGo).toHaveBeenCalledWith(-1)

    await fireEvent.click(submitButton)
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('shows enabled submit when editing', async () => {
    const accountForm = reactive({
      accountId: 1,
      accountName: '佐藤',
      email: 'sato@example.com',
      password: 'secret',
      roleId: 1,
      roleDisplayName: '管理者',
      statusCode: '00',
      statusDisplayName: '有効',
    })

    useAccountsFormMock.mockReturnValue({
      accountFormRef: ref(),
      accountForm,
      accountFormRules: {},
      submitLabel: ref('決定する'),
      handleCancel: vi.fn(),
      handleSubmit: vi.fn(),
      isSubmitPending: ref(true),
      disabled: ref(false),
      accountRoleList: ref({ roles: [{ roleId: 1, roleDisplayName: '管理者' }] }),
      isEdit: ref(true),
    })

    const { getByTestId } = renderAccountsForm()

    // Password field is currently commented out in AccountsForm.vue
    // expect(getByPlaceholderText('半角英数字20文字以内')).toHaveValue('secret')
    const submitButton = getByTestId('submit-button')
    expect(submitButton).toHaveTextContent('決定する')
    expect(submitButton).not.toBeDisabled()
    expect(submitButton.getAttribute('data-loading')).toBe('true')
  })
})
