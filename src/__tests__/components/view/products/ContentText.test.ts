import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import { defineComponent } from 'vue'

import ContentText from '@/components/view/products/ContentText.vue'

const renderContentText = (props?: { data?: Array<{ label?: string; text?: string }> }) => {
  return render(ContentText, {
    // Component prop `data` is required by type but has a default of [].
    // Always provide a concrete array to satisfy TS without altering runtime behavior.
    props: { data: props?.data ?? [] },
    global: {
      stubs: {
        ElText: defineComponent({
          name: 'ElText',
          template: '<p><slot /></p>',
        }),
      },
    },
  })
}

describe('ContentText.vue', () => {
  it('renders label and value pairs for each item', () => {
    const fixture = [
      { label: 'JAN', text: '1234567890123' },
      { label: 'SKU', text: 'SKU-42' },
    ]

    const { container } = renderContentText({ data: fixture })

    expect(container.querySelectorAll('div.flex.flex-col').length).toBe(fixture.length)
    expect(container.textContent).toContain('JAN')
    expect(container.textContent).toContain('1234567890123')
    expect(container.textContent).toContain('SKU')
    expect(container.textContent).toContain('SKU-42')
  })

  it('renders nothing when data is empty by default', () => {
    const { container } = renderContentText()
    expect(container.querySelectorAll('div.flex.flex-col').length).toBe(0)
    expect(container.textContent?.trim()).toBe('')
  })
})
