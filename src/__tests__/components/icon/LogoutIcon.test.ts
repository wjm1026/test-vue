// generated-by: ai-assist v1.0
// type: unit
// description: Unit tests for LogoutIcon.vue verifying SVG attributes, path fill, and clipPath presence.

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'

import LogoutIcon from '@/components/icon/LogoutIcon.vue'

describe('LogoutIcon.vue', () => {
  it('renders SVG with correct size and viewBox', () => {
    const { container } = render(LogoutIcon)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('width')).toBe('16')
    expect(svg?.getAttribute('height')).toBe('16')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 16 16')
  })

  it('contains a path with currentColor fill', () => {
    const { container } = render(LogoutIcon)
    const path = container.querySelector('svg path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('currentColor')
  })

  it('defines a clipPath in defs and references it', () => {
    const { container } = render(LogoutIcon)
    const clip = container.querySelector('svg defs clipPath#clip0_4709_27495')
    const g = container.querySelector('svg g[clip-path="url(#clip0_4709_27495)"]')
    expect(clip).toBeTruthy()
    expect(g).toBeTruthy()
  })
})
