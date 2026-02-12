import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'

import TargetAddIcon from '@/components/icon/TargetAddIcon.vue'

describe('TargetAddIcon.vue', () => {
  it('renders svg element with expected dimensions and namespace', () => {
    // Confirms the icon wrapper keeps its sizing contract.
    const { container } = render(TargetAddIcon)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('16')
    expect(svg?.getAttribute('height')).toBe('16')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 16 16')
    expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg')
  })

  it('contains path data for list glyph with primary fill color', () => {
    // Validates the path retains its blue fill and expected coordinates.
    const { container } = render(TargetAddIcon)
    const path = container.querySelector('svg path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('#FBA123')
    const d = path?.getAttribute('d') ?? ''
    expect(d.includes('13.3327')).toBe(true)
    expect(d.includes('2.66602')).toBe(true)
  })

  it('defines clipPath for masking', () => {
    // Ensures the clipPath definition is present for consistent rendering.
    const { container } = render(TargetAddIcon)
    const clipPath = container.querySelector('clipPath[id="clip0_5062_59898"]')
    expect(clipPath).toBeTruthy()
    expect(clipPath?.querySelector('rect')?.getAttribute('width')).toBe('16')
  })
})
