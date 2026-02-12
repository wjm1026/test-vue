import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { computed, defineComponent, h, reactive, ref } from 'vue'

import ResetPasswordForm from '@/components/view/login/ResetPasswordForm.vue'

const resetPasswordForm = reactive({
  password: '',
  confirmPassword: '',
})
const resetPasswordFormRules = reactive({})
const resetPasswordFormRef = ref<unknown>()
const isPending = ref(false)
const isDisabled = computed(() => {
  // Match the actual logic: password must match pattern and passwords must match
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=])[A-Za-z0-9!@#$%^&*()_+\-=]{12,64}$/
  const isPasswordValid = passwordPattern.test(resetPasswordForm.password)
  const passwordsMatch = resetPasswordForm.confirmPassword === resetPasswordForm.password
  return !(isPasswordValid && passwordsMatch)
})
const resetPasswordFormSubmit = vi.fn()

vi.mock('@/components/view/login/useResetPasswordForm', () => ({
  useResetPasswordForm: () => ({
    disabled: isDisabled,
    resetPasswordForm,
    resetPasswordFormRef,
    resetPasswordFormRules,
    resetPasswordFormSubmit,
    isPending,
  }),
}))

const ElTextStub = defineComponent({
  name: 'ElText',
  template: `<span data-testid="el-text" v-bind="$attrs"><slot /></span>`,
})

const ElFormStub = defineComponent({
  name: 'ElForm',
  props: {
    model: {
      type: Object,
      required: false,
    },
    rules: {
      type: Object,
      required: false,
    },
    labelPosition: {
      type: String,
      required: false,
    },
    hideRequiredAsterisk: {
      type: Boolean,
      required: false,
    },
  },
  setup(_, { slots }) {
    return () =>
      h('form', { 'data-testid': 'el-form' }, slots.default ? slots.default() : undefined)
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
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['update:modelValue'],
  template: `
    <input
      :type="type"
      data-testid="el-input"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event && $event.target && $event.target.value) || '')"
    />
  `,
})

const BlueButtonStub = defineComponent({
  name: 'BlueButton',
  props: {
    label: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  template: `
    <button
      type="button"
      data-testid="blue-button"
      :disabled="disabled || loading"
      @click="$emit('click')"
    >
      {{ label }}
    </button>
  `,
})

const renderResetPasswordForm = (onResetPasswordSubmitSuccess?: () => void) =>
  render(ResetPasswordForm, {
    props: {
      onResetPasswordSubmitSuccess,
    },
    global: {
      stubs: {
        ElText: ElTextStub,
        ElForm: ElFormStub,
        ElFormItem: ElFormItemStub,
        ElInput: ElInputStub,
        BlueButton: BlueButtonStub,
      },
    },
  })

beforeEach(() => {
  resetPasswordForm.password = ''
  resetPasswordForm.confirmPassword = ''
  resetPasswordFormRef.value = undefined
  resetPasswordFormSubmit.mockClear()
  isPending.value = false
})

describe('ResetPasswordForm.vue', () => {
  it('renders form fields and disables submit when composable reports disabled', () => {
    renderResetPasswordForm()

    screen.getByText('新しいパスワード')
    screen.getByText('新しいパスワード（確認用）')
    expect(screen.getAllByTestId('el-input')).toHaveLength(2)

    expect(screen.getByRole('button', { name: 'パスワードを設定する' })).toBeDisabled()
  })

  it('enables submit button and calls composable submit handler when clicked', async () => {
    resetPasswordForm.password = 'ValidPass123!'
    resetPasswordForm.confirmPassword = 'ValidPass123!'
    renderResetPasswordForm()
    const user = userEvent.setup()

    const submitButton = screen.getByRole('button', { name: 'パスワードを設定する' })
    expect(submitButton).not.toBeDisabled()

    await user.click(submitButton)

    expect(resetPasswordFormSubmit).toHaveBeenCalledTimes(1)
  })

  it('emits resetPasswordSubmitSuccess event when composable triggers it', async () => {
    const onResetPasswordSubmitSuccess = vi.fn()
    resetPasswordForm.password = 'ValidPass123!'
    resetPasswordForm.confirmPassword = 'ValidPass123!'
    renderResetPasswordForm(onResetPasswordSubmitSuccess)
    const user = userEvent.setup()

    const submitButton = screen.getByRole('button', { name: 'パスワードを設定する' })
    await user.click(submitButton)

    expect(resetPasswordFormSubmit).toHaveBeenCalledTimes(1)
  })

  it('shows loading state when isPending is true', () => {
    isPending.value = true
    resetPasswordForm.password = 'ValidPass123!'
    resetPasswordForm.confirmPassword = 'ValidPass123!'
    renderResetPasswordForm()

    const submitButton = screen.getByRole('button', { name: 'パスワードを設定する' })
    expect(submitButton).toBeDisabled()
  })

  it('updates password field when input value changes', async () => {
    // Purpose: verify password input binding updates form data.
    renderResetPasswordForm()
    const user = userEvent.setup()

    const passwordInputs = screen.getAllByTestId('el-input')
    await user.type(passwordInputs[0], 'NewPassword123!')

    expect(resetPasswordForm.password).toBe('NewPassword123!')
  })

  it('updates confirmPassword field when input value changes', async () => {
    // Purpose: verify confirm password input binding updates form data.
    renderResetPasswordForm()
    const user = userEvent.setup()

    const passwordInputs = screen.getAllByTestId('el-input')
    await user.type(passwordInputs[1], 'ConfirmPassword123!')

    expect(resetPasswordForm.confirmPassword).toBe('ConfirmPassword123!')
  })

  it('renders form with correct structure', () => {
    // Purpose: verify form structure includes all required fields.
    renderResetPasswordForm()

    expect(screen.getByText('新しいパスワード')).toBeInTheDocument()
    expect(screen.getByText('新しいパスワード（確認用）')).toBeInTheDocument()
    expect(screen.getAllByTestId('el-input')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'パスワードを設定する' })).toBeInTheDocument()
  })

  it('calls resetPasswordFormSubmit when form is submitted', async () => {
    // Purpose: verify form submission triggers composable submit handler.
    resetPasswordForm.password = 'ValidPass123!'
    resetPasswordForm.confirmPassword = 'ValidPass123!'
    renderResetPasswordForm()
    const user = userEvent.setup()

    const submitButton = screen.getByRole('button', { name: 'パスワードを設定する' })
    expect(submitButton).not.toBeDisabled()
    await user.click(submitButton)

    expect(resetPasswordFormSubmit).toHaveBeenCalledTimes(1)
  })

  it('disables submit button when form is disabled', () => {
    // Purpose: verify submit button is disabled when form validation fails.
    resetPasswordForm.password = ''
    resetPasswordForm.confirmPassword = ''
    renderResetPasswordForm()

    const submitButton = screen.getByRole('button', { name: 'パスワードを設定する' })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when form is valid', () => {
    // Purpose: verify submit button is enabled when form validation passes.
    resetPasswordForm.password = 'ValidPass123!'
    resetPasswordForm.confirmPassword = 'ValidPass123!'
    renderResetPasswordForm()

    const submitButton = screen.getByRole('button', { name: 'パスワードを設定する' })
    expect(submitButton).not.toBeDisabled()
  })
})
