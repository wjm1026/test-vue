import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'

import AddIcon from '@/components/icon/AddIcon.vue'

describe('AddIcon.vue', () => {
  it('renders an SVG element with expected attributes', () => {
    // Purpose: confirm base SVG shape and sizing remain consistent.
    const { container } = render(AddIcon)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('41')
    expect(svg?.getAttribute('height')).toBe('40')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 41 40')
    expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg')
  })

  it('contains a plus path with brand fill color', () => {
    // Purpose: ensure the rendered path matches expected fill styling.
    const { container } = render(AddIcon)
    const path = container.querySelector('svg path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('#FBA123')
    const d = path?.getAttribute('d') || ''
    expect(d.startsWith('M')).toBe(true)
    expect(d.includes('37.5469')).toBe(true)
  })
})
