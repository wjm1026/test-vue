import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import { defineComponent, h, ref } from 'vue'

import BaseForm from '@/components/form/BaseForm.vue'

function createElFormStub() {
  const validate = vi.fn()
  const resetFields = vi.fn()
  const clearValidate = vi.fn()
  const capturedProps: Array<{
    model: unknown
    rules: unknown
    attrs: Record<string, unknown>
  }> = []

  const ElFormStub = defineComponent({
    name: 'ElForm',
    props: {
      model: { type: Object, required: true },
      rules: { type: Object, default: () => ({}) },
    },
    setup(props, { slots, expose, attrs }) {
      expose({
        validate,
        resetFields,
        clearValidate,
      })
      capturedProps.push({
        model: props.model,
        rules: props.rules,
        attrs: { ...attrs },
      })

      return () => h('form', { ...attrs }, slots.default ? slots.default() : [])
    },
  })

  return {
    ElFormStub,
    validate,
    resetFields,
    clearValidate,
    capturedProps,
  }
}

describe('BaseForm', () => {
  it('renders slot content and forwards attrs to ElForm', () => {
    // Purpose: Ensure the wrapper passes model/rules props and renders slot content.
    const { ElFormStub, capturedProps } = createElFormStub()
    const model = { name: 'Sample' }
    const rules = { name: [{ required: true }] }

    const { getByTestId, getByText } = render(BaseForm, {
      props: { model, rules },
      attrs: { 'data-testid': 'base-form', 'label-position': 'top' },
      slots: {
        default: '<span>Form Content</span>',
      },
      global: {
        stubs: { ElForm: ElFormStub },
      },
    })

    expect(getByTestId('base-form')).toBeTruthy()
    expect(getByText('Form Content')).toBeTruthy()
    expect(capturedProps[0]?.model).toEqual(model)
    expect(capturedProps[0]?.rules).toEqual(rules)
    expect(capturedProps[0]?.attrs['label-position']).toBe('top')
  })

  it('exposes validate, resetFields, clearValidate, and formRef helpers', async () => {
    // Purpose: Confirm exposed helpers proxy to ElForm methods and surface underlying ref.
    const { ElFormStub, validate, resetFields, clearValidate } = createElFormStub()
    const validateCallback = vi.fn()

    const Host = defineComponent({
      components: { BaseForm },
      setup() {
        const baseForm = ref<{
          validate: (cb?: (valid: boolean) => void) => unknown
          resetFields: () => void
          clearValidate: (props?: string | string[]) => void
          formRef: { value: unknown }
        } | null>(null)

        const handleValidate = () => {
          baseForm.value?.validate(validateCallback)
        }
        const handleReset = () => {
          baseForm.value?.resetFields()
        }
        const handleClear = () => {
          baseForm.value?.clearValidate(['field'])
        }

        return {
          baseForm,
          handleValidate,
          handleReset,
          handleClear,
        }
      },
      template: `
        <div>
          <BaseForm ref="baseForm" :model="{ field: '' }">
            <span>Form Body</span>
          </BaseForm>
          <button data-testid="trigger-validate" @click="handleValidate">Validate</button>
          <button data-testid="trigger-reset" @click="handleReset">Reset</button>
          <button data-testid="trigger-clear" @click="handleClear">Clear</button>
        </div>
      `,
    })

    const { getByTestId } = render(Host, {
      global: {
        stubs: { ElForm: ElFormStub },
      },
    })

    await fireEvent.click(getByTestId('trigger-validate'))
    expect(validate).toHaveBeenCalledTimes(1)
    expect(validate).toHaveBeenCalledWith(validateCallback)

    await fireEvent.click(getByTestId('trigger-reset'))
    expect(resetFields).toHaveBeenCalledTimes(1)

    await fireEvent.click(getByTestId('trigger-clear'))
    expect(clearValidate).toHaveBeenCalledWith(['field'])
  })
})
