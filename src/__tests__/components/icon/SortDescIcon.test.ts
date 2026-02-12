// generated-by: ai-assist v1.0
// type: unit
// description: Unit tests for SortDescIcon.vue verifying SVG attributes and path fill.

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'

import SortDescIcon from '@/components/icon/SortDescIcon.vue'

describe('SortDescIcon.vue', () => {
  it('renders SVG with correct size and viewBox', () => {
    const { container } = render(SortDescIcon)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('12')
    expect(svg?.getAttribute('height')).toBe('13')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 12 13')
  })

  it('contains a path with expected fill color', () => {
    const { container } = render(SortDescIcon)
    const path = container.querySelector('svg path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('#4D4D4D')
  })
})
