// generated-by: ai-assist v1.0
// type: unit
// description: Unit tests for SearchIcon.vue verifying SVG attributes and path fill.

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'

import SearchIcon from '@/components/icon/SearchIcon.vue'

describe('SearchIcon.vue', () => {
  it('renders SVG with correct size and viewBox', () => {
    const { container } = render(SearchIcon)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('16')
    expect(svg?.getAttribute('height')).toBe('16')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 16 16')
  })

  it('contains a path with expected fill color', () => {
    const { container } = render(SearchIcon)
    const path = container.querySelector('svg path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('#999999')
  })
})
