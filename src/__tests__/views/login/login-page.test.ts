import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'

vi.mock('@/components/image/BaseImage.vue', () => ({
  default: {
    name: 'BaseImage',
    template: `<div data-testid='logo-icon'>logo-icon</div>`,
  },
}))

vi.mock('@/components/view/login/LoginForm.vue', () => ({
  default: {
    name: 'LoginForm',
    template: `<form data-testid='login-form'>login-form</form>`,
  },
}))

const renderLoginPage = async () => {
  const { default: LoginPage } = await import('@/views/login/LoginPage.vue')
  return render(LoginPage)
}

describe('LoginPage.vue', () => {
  it('renders logo icon and login form shell', async () => {
    // Ensure the page renders both child components without relying on Element Plus.
    await renderLoginPage()

    expect(screen.getByTestId('logo-icon')).toBeInTheDocument()
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('applies the expected full-screen host layout classes', async () => {
    // Validate the outer wrapper keeps the alignment contract used by other auth screens.
    const { container } = await renderLoginPage()
    const host = container.firstElementChild as HTMLElement | null

    expect(host).not.toBeNull()
    expect(host?.className ?? '').toContain('flex')
    expect(host?.className ?? '').toContain('h-screen')
    expect(host?.className ?? '').toContain('gap-16')
  })
})
