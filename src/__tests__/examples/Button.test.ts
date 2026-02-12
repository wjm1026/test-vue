// generated-by: human-example v1.0
// type: unit
// description: Self-contained test for a Button component with slot, click, and disabled behavior.

import { render, fireEvent } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'

// Self-contained Button component
const Button = defineComponent({
  name: 'AppButton',
  props: {
    disabled: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    const handleClick = (e: Event) => {
      if (!props.disabled) emit('click', e)
    }
    return () =>
      h(
        'button',
        { disabled: props.disabled, onClick: handleClick },
        slots.default ? slots.default() : 'Button',
      )
  },
})

// Helper: render the button with optional props
function renderButton(props = {}, slots = { default: 'Click me' }) {
  return render(Button, { props, slots })
}

describe('Button component', () => {
  it('should render button with slot text', () => {
    const { getByText } = renderButton()
    const btn = getByText('Click me')
    expect(btn).toBeTruthy()
    expect(btn.tagName).toBe('BUTTON')
  })

  it('should emit click event when clicked', async () => {
    const handleClick = vi.fn()
    const { getByText, emitted } = renderButton({ onClick: handleClick })
    const btn = getByText('Click me')
    await fireEvent.click(btn)
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(emitted().click).toBeTruthy()
  })

  it('should not emit click when disabled', async () => {
    const handleClick = vi.fn()
    const { getByText, emitted } = renderButton({ disabled: true, onClick: handleClick })
    const btn = getByText('Click me')
    await fireEvent.click(btn)
    expect(handleClick).not.toHaveBeenCalled()
    expect(emitted().click).toBeFalsy()
  })
})
