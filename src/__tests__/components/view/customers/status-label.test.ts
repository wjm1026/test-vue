// generated-by: ai-assist v1.0
// type: unit
// description: StatusLabel renders background and icon based on status prop.

import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { defineComponent, h } from 'vue'

import StatusLabel from '@/components/view/customers/StatusLabel.vue'

const SuccessIconStub = defineComponent({
  name: 'SuccessIcon',
  props: {
    size: { type: Number, default: 0 },
  },
  setup(props) {
    return () => h('span', { 'data-testid': 'success-icon', 'data-size': String(props.size) })
  },
})

const renderLabel = (status: 'public' | 'private') =>
  render(StatusLabel, {
    props: { status },
    global: { stubs: { SuccessIcon: SuccessIconStub } },
  })

describe('StatusLabel', () => {
  it('shows success styles and icon when status is public', () => {
    const { getByTestId } = renderLabel('public')
    const container = getByTestId('success-icon').parentElement as HTMLElement

    expect(container.className).toContain('bg-success')
    expect(getByTestId('success-icon').getAttribute('data-size')).toBe('12')
  })

  it('applies gray background and hides icon when status is private', () => {
    const { queryByTestId, container } = renderLabel('private')

    expect(container.firstElementChild?.className).toContain('bg-gray300')
    expect(queryByTestId('success-icon')).toBeNull()
  })
})
