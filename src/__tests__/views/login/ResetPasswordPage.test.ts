import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

const pushMock = vi.hoisted(() => vi.fn())
const elMessageErrorMock = vi.hoisted(() => vi.fn())
const useRouteMock = vi.hoisted(() => vi.fn())
const useRouterMock = vi.hoisted(() => vi.fn())

vi.mock('vue-router', () => ({
  useRoute: () => useRouteMock(),
  useRouter: () => useRouterMock(),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    error: elMessageErrorMock,
  },
}))

vi.mock('@/router/routes', () => ({
  routePaths: {
    login: '/login',
  },
}))

vi.mock('@/components/view/login/ResetPasswordForm.vue', () => ({
  default: {
    name: 'ResetPasswordForm',
    emits: ['resetPasswordSubmitSuccess'],
    template: `
      <section data-testid="reset-form">
        <button
          type="button"
          data-testid="complete-reset"
          @click="$emit('resetPasswordSubmitSuccess')"
        >
          complete
        </button>
      </section>
    `,
  },
}))

vi.mock('@/components/view/login/ResetPasswordNotice.vue', () => ({
  default: {
    name: 'ResetPasswordNotice',
    template: `<section data-testid="reset-notice"></section>`,
  },
}))

const renderResetPasswordPage = async (routeOverrides?: Record<string, unknown>) => {
  vi.resetModules()
  useRouteMock.mockReturnValue(routeOverrides ?? { query: { token: 'token-123' } })
  useRouterMock.mockReturnValue({ push: pushMock })
  const { default: ResetPasswordPage } = await import('@/views/login/ResetPasswordPage.vue')
  return render(ResetPasswordPage)
}

beforeEach(() => {
  pushMock.mockClear()
  elMessageErrorMock.mockClear()
  useRouteMock.mockReset()
  useRouterMock.mockReset()
})

describe('ResetPasswordPage.vue', () => {
  it('shows the reset form initially and switches to notice after completion', async () => {
    await renderResetPasswordPage()
    const user = userEvent.setup()

    expect(screen.getByTestId('reset-form')).toBeInTheDocument()
    expect(screen.queryByTestId('reset-notice')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('complete-reset'))

    expect(screen.queryByTestId('reset-form')).not.toBeInTheDocument()
    expect(screen.getByTestId('reset-notice')).toBeInTheDocument()
    expect(elMessageErrorMock).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('redirects to login with error when token is missing', async () => {
    await renderResetPasswordPage({ query: {} })

    expect(elMessageErrorMock).toHaveBeenCalledWith(expect.any(String))
    expect(pushMock).toHaveBeenCalledWith('/login')
  })
})
