// generated-by: ai-assist v1.0
// type: unit
// description: NotFound view test ensuring 404 messaging renders.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent } from 'vue'

import NotFound from '@/views/not-found/NotFound.vue'
import { routePaths } from '@/router/routes'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

const renderNotFound = () =>
  render(NotFound, {
    global: {
      stubs: {
        ElText: defineComponent({
          name: 'ElTextStub',
          template: `<span data-testid="el-text"><slot /></span>`,
        }),
        BlueButton: defineComponent({
          name: 'BlueButtonStub',
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

describe('NotFound view', () => {
  it('renders 404 messaging and description', () => {
    renderNotFound()

    expect(screen.getByText('お探しのページが見つかりませんでした')).toBeInTheDocument()
    expect(
      screen.getByText(
        '大変申し訳ございません。お探しのページは移動したか、URLが古くなっている可能性があります。お手数ですが、下のボタンからトップページにお戻りいただき、もう一度お探しください。',
      ),
    ).toBeInTheDocument()
  })

  it('navigates to projects root when back to top button is clicked', async () => {
    renderNotFound()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'トップへ戻る' }))

    expect(pushMock).toHaveBeenCalledWith(routePaths.projects.root)
  })
})
