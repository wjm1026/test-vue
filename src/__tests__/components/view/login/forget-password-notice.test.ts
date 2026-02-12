import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent } from 'vue'

import ForgetPasswordNotice from '@/components/view/login/ForgetPasswordNotice.vue'
import { routePaths } from '@/router/routes'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

const renderForgetPasswordNotice = () =>
  render(ForgetPasswordNotice, {
    global: {
      stubs: {
        ElText: defineComponent({
          name: 'ElTextStub',
          template: `<span data-testid="el-text"><slot /></span>`,
        }),
        WhiteButton: defineComponent({
          name: 'WhiteButtonStub',
          props: {
            label: {
              type: String,
              required: true,
            },
          },
          emits: ['click'],
          template: `
            <button type="button" data-testid="white-button" @click="$emit('click')">
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

describe('ForgetPasswordNotice.vue', () => {
  // Ensures the component renders the confirmation and guidance copy for the reset flow.
  it('shows the re-send confirmation message and instructions', () => {
    renderForgetPasswordNotice()

    expect(screen.getByText('パスワードの再設定メールを送信しました')).toBeInTheDocument()
    expect(
      screen.getByText(
        '届いたメールに記載されているURLからパスワードの再設定を行ってください。メールが届かない場合は、ログインページから再度送信してください。',
      ),
    ).toBeInTheDocument()
  })

  // Verifies button routes to the login page.
  it('routes to login page when the button is clicked', async () => {
    renderForgetPasswordNotice()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'ログインページへ' }))

    expect(pushMock).toHaveBeenCalledWith(routePaths.login)
  })
})
