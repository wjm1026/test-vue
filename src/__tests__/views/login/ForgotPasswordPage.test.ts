import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { ref } from 'vue'

const activeStep = ref(0)
const savedEmail = ref('')
const emailSubmitSuccess = vi.fn((email: string) => {
  savedEmail.value = email
  activeStep.value = 1
})

vi.mock('@/views/login/useForgetPasswordPage', () => ({
  useForgetPasswordPage: () => ({
    activeStep,
    emailSubmitSuccess,
    savedEmail,
  }),
}))

vi.mock('@/components/view/login/ForgetPasswordForm.vue', () => ({
  default: {
    name: 'ForgetPasswordForm',
    props: {
      initialEmail: {
        type: String,
        default: '',
      },
    },
    emits: ['emailSubmitSuccess'],
    template: `
      <section data-testid="form">
        <button
          type="button"
          data-testid="form-send"
          @click="$emit('emailSubmitSuccess', 'user@example.com')"
        >
          form-send
        </button>
      </section>
    `,
  },
}))

vi.mock('@/components/view/login/ForgetPasswordNotice.vue', () => ({
  default: {
    name: 'ForgetPasswordNotice',
    template: `
      <section data-testid="notice">
        notice
      </section>
    `,
  },
}))

const renderForgotPasswordPage = async () => {
  const { default: ForgotPasswordPage } = await import('@/views/login/ForgotPasswordPage.vue')
  return render(ForgotPasswordPage)
}

describe('ForgotPasswordPage.vue', () => {
  it('shows the form on the initial step and switches to notice after emailSubmitSuccess', async () => {
    activeStep.value = 0
    emailSubmitSuccess.mockImplementation((email: string) => {
      savedEmail.value = email
      activeStep.value = 1
    })

    await renderForgotPasswordPage()
    const user = userEvent.setup()

    expect(screen.queryByTestId('form')).toBeInTheDocument()
    expect(screen.queryByTestId('notice')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('form-send'))

    expect(emailSubmitSuccess).toHaveBeenCalledTimes(1)
    expect(emailSubmitSuccess).toHaveBeenCalledWith('user@example.com')
    expect(savedEmail.value).toBe('user@example.com')
    expect(screen.queryByTestId('form')).not.toBeInTheDocument()
    expect(screen.queryByTestId('notice')).toBeInTheDocument()
  })
})
