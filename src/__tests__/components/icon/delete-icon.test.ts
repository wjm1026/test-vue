// generated-by: ai-assist v1.0
// type: unit
// description: Unit tests for DeleteIcon.vue verifying SVG sizing and shape colors.

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'

import DeleteIcon from '@/components/icon/DeleteIcon.vue'

describe('DeleteIcon.vue', () => {
  it('renders svg with expected dimensions and viewBox', () => {
    const { container } = render(DeleteIcon)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('31')
    expect(svg?.getAttribute('height')).toBe('30')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 31 30')
  })

  it('includes circle and path with configured fill colors', () => {
    const { container } = render(DeleteIcon)
    const circle = container.querySelector('svg circle')
    const path = container.querySelector('svg path')
    expect(circle).toBeTruthy()
    expect(path).toBeTruthy()
    expect(circle?.getAttribute('fill')).toBe('#E6E6E6')
    expect(path?.getAttribute('fill')).toBe('#999999')
  })
})
