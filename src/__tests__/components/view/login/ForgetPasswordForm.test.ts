import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { computed, defineComponent, h, reactive, ref } from 'vue'

import ForgetPasswordForm from '@/components/view/login/ForgetPasswordForm.vue'

const forgetPasswordForm = reactive({ email: '' })
const forgetPasswordFormRules = reactive({})
const forgetPasswordFormRef = ref<unknown>()
const goBack = vi.fn()
const isPending = ref(false)
const disabled = computed(() => !forgetPasswordForm.email)

let validationResult = true
const validateMock = vi.fn(async (callback?: (valid: boolean) => void) => {
  callback?.(validationResult)
  return validationResult
})

let capturedEmit: ((event: 'emailSubmitSuccess', email: string) => void) | undefined

const forgetPasswordFormSubmit = vi.fn(async () => {
  const isValid = await validateMock((valid) => valid)
  if (isValid && capturedEmit) {
    capturedEmit('emailSubmitSuccess', forgetPasswordForm.email)
  }
})

vi.mock('@/components/view/login/useForgetPasswordForm', () => ({
  useForgetPasswordForm: (
    emit: (event: 'emailSubmitSuccess', email: string) => void,
    initialEmail?: string,
  ) => {
    capturedEmit = emit
    forgetPasswordForm.email = initialEmail || ''
    forgetPasswordFormRef.value = {
      validate: validateMock,
    }
    return {
      disabled,
      forgetPasswordForm,
      forgetPasswordFormRef,
      forgetPasswordFormRules,
      forgetPasswordFormSubmit,
      goBack,
      isPending,
    }
  },
}))

const ElTextStub = defineComponent({
  name: 'ElText',
  inheritAttrs: false,
  template: `<span v-bind="$attrs"><slot /></span>`,
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
  },
  emits: ['update:modelValue'],
  template: `
    <input
      type="text"
      data-testid="email-input"
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

const ElButtonStub = defineComponent({
  name: 'ElButton',
  props: {
    text: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  template: `
    <button type="button" data-testid="el-button" @click="$emit('click')">
      <slot />
    </button>
  `,
})

const renderForgetPasswordForm = () =>
  render(ForgetPasswordForm, {
    global: {
      stubs: {
        ElText: ElTextStub,
        ElForm: ElFormStub,
        ElFormItem: ElFormItemStub,
        ElInput: ElInputStub,
        BlueButton: BlueButtonStub,
        ElButton: ElButtonStub,
      },
    },
  })

beforeEach(() => {
  forgetPasswordForm.email = ''
  forgetPasswordFormRef.value = undefined
  goBack.mockClear()
  validationResult = true
  validateMock.mockClear()
  forgetPasswordFormSubmit.mockClear()
  isPending.value = false
})

describe('ForgetPasswordForm.vue', () => {
  it('renders instructions and disables the submit button when email is empty', () => {
    renderForgetPasswordForm()

    screen.getByText('パスワードをお忘れの場合')
    screen.getByText(
      'メールアドレスを入力してください。ご入力いただいたメールアドレス宛にパスワードの再設定メールのお送りします。',
    )
    screen.getByText('メールアドレス')
    expect(screen.getByPlaceholderText('sample@example.com')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: '送信する' })).toBeDisabled()
  })

  it('emits emailSubmitSuccess after a successful validation', async () => {
    const view = renderForgetPasswordForm()
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('sample@example.com'), 'user@example.com')
    expect(screen.getByRole('button', { name: '送信する' })).not.toBeDisabled()

    await user.click(screen.getByRole('button', { name: '送信する' }))

    expect(validateMock).toHaveBeenCalledTimes(1)
    expect(forgetPasswordFormSubmit).toHaveBeenCalledTimes(1)
    expect(view.emitted()['emailSubmitSuccess']).toEqual([['user@example.com']])
  })

  it('does not emit emailSubmitSuccess when validation fails', async () => {
    validationResult = false
    const view = renderForgetPasswordForm()
    const user = userEvent.setup()

    await user.type(screen.getByPlaceholderText('sample@example.com'), 'failure@example.com')
    expect(screen.getByRole('button', { name: '送信する' })).not.toBeDisabled()

    await user.click(screen.getByRole('button', { name: '送信する' }))

    expect(validateMock).toHaveBeenCalledTimes(1)
    expect(view.emitted().emailSubmitSuccess).toBeUndefined()
  })

  it('invokes goBack when the back button is pressed', async () => {
    renderForgetPasswordForm()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: '戻る' }))

    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
