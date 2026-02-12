import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent } from 'vue'

import ResetPasswordNotice from '@/components/view/login/ResetPasswordNotice.vue'
import { routePaths } from '@/router/routes'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

const renderResetPasswordNotice = () =>
  render(ResetPasswordNotice, {
    global: {
      stubs: {
        ElText: defineComponent({
          name: 'ElText',
          template: `<span data-testid="el-text"><slot /></span>`,
        }),
        BlueButton: defineComponent({
          name: 'BlueButton',
          props: {
            label: {
              type: String,
              required: true,
            },
          },
          emits: ['click'],
          template: `
            <button type="button" data-testid="blue-button" @click="$emit('click')">
              {{ label }}
            </button>
          `,
        }),
      },
    },
  })

beforeEach(() => {
  pushMock.mockClear()
})

describe('ResetPasswordNotice.vue', () => {
  it('renders the success message and instruction', () => {
    renderResetPasswordNotice()

    expect(screen.getByText('パスワードを再設定しました')).toBeInTheDocument()
    expect(
      screen.getByText('ログインページから新しいパスワードでログインしてください。'),
    ).toBeInTheDocument()
  })

  it('routes to login when the button is clicked', async () => {
    renderResetPasswordNotice()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'ログインページへ' }))

    expect(pushMock).toHaveBeenCalledWith(routePaths.login)
  })
})
