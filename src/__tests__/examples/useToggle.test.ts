// generated-by: human-example v1.0
// type: unit
// description: Self-contained test for a useToggle composable with toggle and reset behavior.

import { describe, it, expect } from 'vitest'
import { ref } from 'vue'

// Self-contained useToggle composable
function useToggle(initial = false) {
  const state = ref(initial)
  const toggle = () => (state.value = !state.value)
  const reset = () => (state.value = initial)
  return { state, toggle, reset }
}

describe('useToggle composable', () => {
  it('should initialize with false by default', () => {
    const toggle = useToggle()
    expect(toggle.state.value).toBe(false)
  })

  it('should toggle state', () => {
    const toggle = useToggle()
    toggle.toggle()
    expect(toggle.state.value).toBe(true)
    toggle.toggle()
    expect(toggle.state.value).toBe(false)
  })

  it('should reset state to initial', () => {
    const toggle = useToggle(true)
    toggle.toggle()
    expect(toggle.state.value).toBe(false)
    toggle.reset()
    expect(toggle.state.value).toBe(true)
  })
})
