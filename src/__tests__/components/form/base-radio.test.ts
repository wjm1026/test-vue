import { beforeEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { defineComponent, h } from 'vue'

import BaseRadio from '@/components/form/BaseRadio.vue'

const capturedAttrs: Array<Record<string, unknown>> = []

const ElRadioStub = defineComponent({
  name: 'ElRadioStub',
  setup(_, { slots, attrs }) {
    capturedAttrs.push({ ...attrs })
    return () =>
      h(
        'label',
        {
          ...attrs,
        },
        slots.default ? slots.default() : [],
      )
  },
})

describe('BaseRadio.vue', () => {
  beforeEach(() => {
    capturedAttrs.length = 0
  })

  it('applies base styles, merges extra classes, and forwards arbitrary attrs', () => {
    // Ensures the component composes tailwind classes while passing attributes to ElRadio.
    const { getByTestId, getByText } = render(BaseRadio, {
      props: {
        className: 'text-red-500 tracking-wide',
      },
      attrs: {
        label: 'option-a',
        'data-testid': 'base-radio',
      },
      slots: {
        default: 'Radio Label',
      },
      global: {
        stubs: {
          ElRadio: ElRadioStub,
        },
      },
    })

    const radio = getByTestId('base-radio')
    expect(radio.className).toContain('font-medium')
    expect(radio.className).toContain('text-red-500')
    expect(radio.className).toContain('tracking-wide')
    expect(radio.className).not.toContain('text-gray800')
    expect(getByText('Radio Label')).toBeTruthy()
    expect(capturedAttrs[0]?.label).toBe('option-a')
    expect(capturedAttrs[0]?.class).toContain('font-medium')
    expect(capturedAttrs[0]?.class).toContain('text-red-500')
    expect(capturedAttrs[0]?.class).toContain('tracking-wide')
  })

  it('falls back to default classes when no className prop is provided', () => {
    // Validates default styling is preserved without custom class overrides.
    const { getByTestId } = render(BaseRadio, {
      attrs: {
        'data-testid': 'base-radio-default',
      },
      slots: {
        default: 'Default Label',
      },
      global: {
        stubs: {
          ElRadio: ElRadioStub,
        },
      },
    })

    const radio = getByTestId('base-radio-default')
    expect(radio.className).toContain('text-gray800')
    expect(radio.className).toContain('font-medium')
    expect(capturedAttrs[0]?.class).toContain('text-gray800')
    expect(capturedAttrs[0]?.class).toContain('font-medium')
  })
})
