// generated-by: ai-assist v1.0
// type: unit
// description: PendingIcon tests ensuring SVG circle structure and attributes.

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'

import PendingIcon from '@/components/icon/PendingIcon.vue'

describe('PendingIcon.vue', () => {
  it('renders svg with expected dimensions and namespace', () => {
    const { container } = render(PendingIcon)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('12')
    expect(svg?.getAttribute('height')).toBe('12')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 12 12')
    expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg')
  })

  it('renders a circle centered with yellow fill', () => {
    const { container } = render(PendingIcon)
    const circle = container.querySelector('circle')
    expect(circle).toBeTruthy()
    expect(circle?.getAttribute('cx')).toBe('6')
    expect(circle?.getAttribute('cy')).toBe('6')
    expect(circle?.getAttribute('r')).toBe('6')
    expect(circle?.getAttribute('fill')).toBe('#FFE100')
  })
})
