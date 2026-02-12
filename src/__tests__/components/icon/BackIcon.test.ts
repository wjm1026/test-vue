// generated-by: ai-assist v1.0
// type: unit
// description: Unit tests for BackIcon.vue verifying SVG structure, attributes, and path fill.

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'

import BackIcon from '@/components/icon/BackIcon.vue'

describe('BackIcon.vue', () => {
  it('renders an SVG with expected dimensions and viewBox', () => {
    const { container } = render(BackIcon)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('20')
    expect(svg?.getAttribute('height')).toBe('20')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 20 20')
    expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg')
  })

  it('contains a path element with the expected fill color', () => {
    const { container } = render(BackIcon)
    const path = container.querySelector('svg path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('#4D4D4D')
  })

  it('contains a path data attribute that defines the back arrow shape', () => {
    const { container } = render(BackIcon)
    const path = container.querySelector('svg path')
    const d = path?.getAttribute('d') || ''
    // Basic sanity: path data starts with Move command and includes expected coordinates
    expect(d.startsWith('M')).toBe(true)
    expect(d.includes('12.2574')).toBe(true)
    expect(d.length).toBeGreaterThan(10)
  })
})
