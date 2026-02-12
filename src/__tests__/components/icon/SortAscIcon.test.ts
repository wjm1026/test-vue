// generated-by: ai-assist v1.0
// type: unit
// description: Unit tests for SortAscIcon.vue verifying SVG attributes, rotation class, and path fill.

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'

import SortAscIcon from '@/components/icon/SortAscIcon.vue'

describe('SortAscIcon.vue', () => {
  it('renders SVG with correct size and viewBox and rotation class', () => {
    const { container } = render(SortAscIcon)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('12')
    expect(svg?.getAttribute('height')).toBe('13')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 12 13')
    expect(svg?.classList.contains('rotate-180')).toBe(true)
  })

  it('contains a path with expected fill color', () => {
    const { container } = render(SortAscIcon)
    const path = container.querySelector('svg path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('#4D4D4D')
  })
})
