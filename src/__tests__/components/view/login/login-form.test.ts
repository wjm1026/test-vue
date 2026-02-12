import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { computed, defineComponent, h, reactive, ref } from 'vue'

import LoginForm from '@/components/view/login/LoginForm.vue'

const loginForm = reactive({
  email: '',
  password: '',
})
const loginFormRules = reactive({})
const loginFormRef = ref<unknown>()
const loginFormSubmit = vi.fn()
const forgetPasswordHandle = vi.fn()
const disabled = computed(() => !loginForm.email || !loginForm.password)

vi.mock('@/components/view/login/useLoginForm', () => ({
  useLoginForm: () => ({
    disabled,
    loginForm,
    loginFormRef,
    loginFormRules,
    loginFormSubmit,
    forgetPasswordHandle,
  }),
}))

const ElFormStub = defineComponent({
  name: 'ElForm',
  props: {
    model: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    labelPosition: {
      type: String,
      default: 'top',
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: false,
    },
  },
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'form',
        {
          'data-testid': 'login-form',
          class: attrs.class as string | undefined,
          onSubmit: attrs.onSubmit as ((e: Event) => void) | undefined,
        },
        slots.default ? slots.default() : undefined,
      )
  },
})

const ElFormItemStub = defineComponent({
  name: 'ElFormItem',
  props: {
    label: {
      type: String,
      default: '',
    },
    prop: {
      type: String,
      default: '',
    },
  },
  template: `
    <label class="form-item">
      <span>{{ label }}</span>
      <slot />
    </label>
  `,
})

const ElInputStub = defineComponent({
  name: 'ElInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  template: `
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event && $event.target && $event.target.value) || '')"
    />
  `,
})

const ElTextStub = defineComponent({
  name: 'ElText',
  emits: ['click'],
  template: `
    <span class="el-text" data-testid="forget-password-text" @click="$emit('click')">
      <slot />
    </span>
  `,
})

const BlueButtonStub = defineComponent({
  name: 'BlueButton',
  props: {
    label: {
      type: String,
      required: true,
    },
    nativeType: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  template: `
    <button
      :type="nativeType"
      data-testid="submit-button"
      :disabled="disabled"
    >
      {{ label }}
    </button>
  `,
})

const renderLoginForm = () =>
  render(LoginForm, {
    global: {
      stubs: {
        ElForm: ElFormStub,
        ElFormItem: ElFormItemStub,
        ElInput: ElInputStub,
        ElText: ElTextStub,
        BlueButton: BlueButtonStub,
      },
    },
  })

beforeEach(() => {
  loginForm.email = ''
  loginForm.password = ''
  loginFormRef.value = undefined
  loginFormSubmit.mockClear()
  forgetPasswordHandle.mockClear()
})

describe('LoginForm.vue', () => {
  it('renders fields and keeps submit disabled until both inputs are filled', async () => {
    // Purpose: Verify the form structure and disabled state when required fields are empty.
    renderLoginForm()
    const user = userEvent.setup()

    screen.getByText('メールアドレス')
    screen.getByText('パスワード')
    const emailInput = screen.getByPlaceholderText('sample@example.com')
    const passwordInput = screen.getByPlaceholderText('半角英数字20文字以内')
    screen.getByText('ログインする')
    const submitButton = screen.getByTestId('submit-button')

    expect(submitButton).toBeDisabled()

    await user.type(emailInput, 'user@example.com')
    expect(submitButton).toBeDisabled()

    await user.type(passwordInput, 'secret123')
    expect(submitButton).not.toBeDisabled()
  })

  it('submits the form through loginFormSubmit when native button is pressed', async () => {
    // Purpose: Ensure the submit handler wires to the form submit event.
    renderLoginForm()
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('sample@example.com'), 'user@example.com')
    await user.type(screen.getByPlaceholderText('半角英数字20文字以内'), 'secret123')

    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    expect(loginFormSubmit).toHaveBeenCalledTimes(1)
  })

  it('invokes forgetPasswordHandle when the help text is clicked', async () => {
    // Purpose: Confirm the password reset link triggers its handler.
    renderLoginForm()
    const user = userEvent.setup()

    await user.click(screen.getByTestId('forget-password-text'))

    expect(forgetPasswordHandle).toHaveBeenCalledTimes(1)
  })
})
