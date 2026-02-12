// generated-by: human-example v1.0
// type: unit
// description: Self-contained test for a Counter component with increment, decrement, and boundary behavior.

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import { defineComponent, ref, h } from 'vue'

// Self-contained Counter component
const Counter = defineComponent({
  name: 'Counter',
  setup() {
    const count = ref(0)
    const increment = () => count.value++
    const decrement = () => {
      if (count.value > 0) count.value--
    }
    return () =>
      h('div', [
        h('span', { 'data-testid': 'count' }, count.value.toString()),
        h('button', { onClick: increment }, 'Increment'),
        h('button', { onClick: decrement }, 'Decrement'),
      ])
  },
})

describe('Counter component', () => {
  it('should render initial count 0', () => {
    const { getByTestId } = render(Counter)
    expect(getByTestId('count').textContent).toBe('0')
  })

  it('should increment count when increment button clicked', async () => {
    const { getByText, getByTestId } = render(Counter)
    const incBtn = getByText('Increment')
    await fireEvent.click(incBtn)
    expect(getByTestId('count').textContent).toBe('1')
  })

  it('should not decrement below 0', async () => {
    const { getByText, getByTestId } = render(Counter)
    const decBtn = getByText('Decrement')
    await fireEvent.click(decBtn)
    expect(getByTestId('count').textContent).toBe('0')
  })
})
