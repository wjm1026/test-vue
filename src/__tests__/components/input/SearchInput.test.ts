// generated-by: ai-assist v1.0
// type: unit
// description: Unit tests for SearchInput.vue verifying placeholder rendering, v-model updates, initial value binding, and clearing behavior. Also checks prefix SearchIcon presence.

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent, ref } from 'vue'

import SearchInput from '@/components/input/SearchInput.vue'

describe('SearchInput.vue', () => {
  it('renders an input with the provided placeholder and shows prefix icon', () => {
    const { container } = render(SearchInput, {
      props: { placeholder: '検索ワード' },
    })

    // Placeholder should be applied to the underlying input element
    const input = screen.getByPlaceholderText('検索ワード')
    expect(input).toBeInTheDocument()

    // Prefix icon slot should render an SVG (SearchIcon)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('updates v-model when user types text', async () => {
    // Use a host component to actually bind v-model and reflect updates
    const Host = defineComponent({
      components: { SearchInput },
      setup() {
        const value = ref('')
        return { value }
      },
      template: '<SearchInput placeholder="Search" v-model="value" />',
    })

    render(Host)

    const textbox = screen.getByRole('textbox')
    await userEvent.type(textbox, 'alpha')

    // The input reflects the latest value when parent updates its model
    expect(screen.getByDisplayValue('alpha')).toBeInTheDocument()
  })

  it('respects initial modelValue and can be cleared', async () => {
    const onUpdate = vi.fn()
    render(SearchInput, {
      props: { placeholder: 'Search', modelValue: 'init', 'onUpdate:modelValue': onUpdate },
    })

    // Initial value should be visible
    expect(screen.getByDisplayValue('init')).toBeInTheDocument()

    // Clear text and verify model updated to empty string
    const textbox = screen.getByRole('textbox')
    await userEvent.clear(textbox)
    const calls = onUpdate.mock.calls
    expect(calls.length).toBeGreaterThan(0)
    expect(calls[calls.length - 1][0]).toBe('')
  })
})
