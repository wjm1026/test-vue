// generated-by: ai-assist v1.0
// type: unit
// description: Unit tests for AddButton.vue verifying default label text, prop override, and enabled state.

import { describe, it, expect } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/vue'
// No need to stub Element Plus here; use the real rendered button and query by role

import AddButton from '@/components/button/AddButton.vue'

function renderAddButton(options: { props?: Record<string, unknown> } = {}) {
  const { props } = options
  return render(AddButton, { props })
}

describe('AddButton.vue', () => {
  it('renders default label when no props provided', () => {
    renderAddButton()
    const btn = screen.getByRole('button', { name: /新規作成/ })
    expect(btn).toBeInTheDocument()
  })

  it('is enabled and does not emit custom events on click', async () => {
    const { emitted } = renderAddButton()
    const btn = screen.getByRole('button', { name: /新規作成/ })
    expect(btn).toBeEnabled()
    await fireEvent.click(btn)
    expect(emitted().add).toBeUndefined()
  })

  it('renders custom label when provided via props', () => {
    renderAddButton({ props: { label: 'Create' } })
    const btn = screen.getByRole('button', { name: /Create/ })
    expect(btn).toBeInTheDocument()
  })
})
