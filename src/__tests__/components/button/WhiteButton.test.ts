import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent } from 'vue'

import WhiteButton from '@/components/button/WhiteButton.vue'

const renderWhiteButton = (props: { label: string; className?: string }) =>
  render(WhiteButton, {
    props,
    global: {
      stubs: {
        ElButton: defineComponent({
          name: 'ElButton',
          emits: ['click'],
          template: `
            <button type="button" data-testid="el-button" v-bind="$attrs" @click="$emit('click')">
              <slot />
            </button>
          `,
        }),
      },
    },
  })

describe('WhiteButton.vue', () => {
  it('renders the provided label and default styling', () => {
    renderWhiteButton({ label: '削除する' })

    const button = screen.getByRole('button', { name: '削除する' })
    const className = button.getAttribute('class') || ''
    expect(className).toContain('rounded-sm')
    expect(className).toContain('font-bold')
    expect(className).toContain('border-primary500')
    expect(className).toContain('text-primary500')
  })

  it('merges additional class names and emits click events', async () => {
    const view = renderWhiteButton({ label: '編集する', className: 'w-10 bg-blue-01' })

    const button = screen.getByRole('button', { name: '編集する' })
    const className = button.getAttribute('class') || ''
    expect(className).toContain('w-10')
    expect(className).toContain('bg-blue-01')

    const user = userEvent.setup()
    await user.click(button)
    expect(view.emitted().click).toHaveLength(1)
  })
})
