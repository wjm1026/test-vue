import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render as renderComponent } from '@testing-library/vue'
import { defineComponent, h, render as renderVNode, type PropType } from 'vue'
import { ElIcon } from 'element-plus'

const datePickerInvocations: Array<{
  props: {
    type: string
    clearable: boolean
    prefixIcon?: { render: () => unknown }
  }
  attrs: Record<string, unknown>
}> = []

const ElDatePickerStub = defineComponent({
  name: 'ElDatePickerStub',
  props: {
    type: { type: String as PropType<string>, default: '' },
    clearable: { type: Boolean as PropType<boolean>, default: true },
    prefixIcon: {
      type: Object as PropType<{ render: () => unknown }>,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    datePickerInvocations.push({
      props: {
        type: props.type,
        clearable: props.clearable,
        prefixIcon: props.prefixIcon,
      },
      attrs: { ...attrs },
    })
    return () =>
      h(
        'input',
        {
          'data-testid': 'el-date-picker',
          ...attrs,
        },
        slots.default ? slots.default() : [],
      )
  },
})

const DateIconRenderSpy = vi.hoisted(() => vi.fn())

vi.mock('@/components/icon/DateIcon.vue', async () => {
  const vue = await vi.importActual<typeof import('vue')>('vue')
  return {
    default: vue.defineComponent({
      name: 'DateIconStub',
      setup() {
        return () => {
          DateIconRenderSpy()
          return vue.h('svg', { 'data-testid': 'date-icon-stub' })
        }
      },
    }),
  }
})

import BaseDatePicker from '@/components/form/BaseDatePicker.vue'

describe('BaseDatePicker.vue', () => {
  beforeEach(() => {
    datePickerInvocations.length = 0
    DateIconRenderSpy.mockReset()
  })

  it('merges classes, forwards attrs, and sets date picker defaults', () => {
    // Ensures the wrapper applies tailwind defaults and Element Plus configuration.
    renderComponent(BaseDatePicker, {
      props: {
        className: 'bg-red-500',
      },
      attrs: {
        placeholder: '日付を選択',
      },
      global: {
        stubs: {
          ElDatePicker: ElDatePickerStub,
        },
      },
    })

    const invocation = datePickerInvocations.at(-1)
    expect(invocation).toBeTruthy()
    expect(invocation?.props.type).toBe('date')
    expect(invocation?.props.clearable).toBe(false)
    expect(invocation?.attrs.placeholder).toBe('日付を選択')
    expect(invocation?.attrs.class).toContain('w-[120px]')
    expect(invocation?.attrs.class).toContain('text-[11px]')
    expect(invocation?.attrs.class).toContain('bg-red-500')
  })

  it('provides a prefix icon that renders DateIcon via ElIcon', () => {
    // Validates the iconPrefix ref renders ElIcon with DateIcon as its default slot.
    renderComponent(BaseDatePicker, {
      global: {
        stubs: {
          ElDatePicker: ElDatePickerStub,
        },
      },
    })

    const invocation = datePickerInvocations.at(-1)
    const prefixIcon = invocation?.props.prefixIcon
    expect(prefixIcon).toBeTruthy()
    expect(typeof prefixIcon?.render).toBe('function')

    const iconVNode = prefixIcon?.render()
    expect(iconVNode && typeof iconVNode === 'object').toBeTruthy()
    expect((iconVNode as { type?: unknown }).type).toBe(ElIcon)
    expect((iconVNode as { props?: Record<string, unknown> }).props?.size).toBe(14)

    const container = document.createElement('div')
    renderVNode(iconVNode as never, container)

    expect(container.querySelector('[data-testid="date-icon-stub"]')).toBeTruthy()
    expect(DateIconRenderSpy).toHaveBeenCalledTimes(1)

    renderVNode(null, container)
  })
})
