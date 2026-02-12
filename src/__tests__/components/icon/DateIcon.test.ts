import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'

import DateIcon from '@/components/icon/DateIcon.vue'

describe('DateIcon.vue', () => {
  it('renders the calendar svg with fixed dimensions', () => {
    // Ensures the base calendar icon maintains the expected size attributes.
    const { container } = render(DateIcon)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('14')
    expect(svg?.getAttribute('height')).toBe('14')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 14 14')
    expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg')
  })

  it('contains the calendar glyph path with gray fill', () => {
    // Verifies the path data and fill color are preserved.
    const { container } = render(DateIcon)
    const path = container.querySelector('svg path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('#999999')
    const d = path?.getAttribute('d') ?? ''
    expect(d.includes('9.91667 1.16663')).toBe(true)
    expect(d.includes('11.0833 11.6666')).toBe(true)
  })

  it('includes clipPath definition for svg masking', () => {
    // Confirms the icon still ships with its clipPath id reference.
    const { container } = render(DateIcon)
    const clipPath = container.querySelector('clipPath[id="clip0_5062_59880"]')
    expect(clipPath).toBeTruthy()
    expect(clipPath?.querySelector('rect')?.getAttribute('width')).toBe('14')
  })
})
