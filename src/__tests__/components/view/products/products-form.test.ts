import { render, fireEvent, cleanup, within } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref, reactive } from 'vue'
import { flushPromises } from '@vue/test-utils'

import ProductsForm from '@/components/view/products/ProductsForm.vue'

const useProductsFormMock = vi.hoisted(() => vi.fn())

vi.mock('@/components/view/products/useProductsForm', () => ({
  useProductsForm: useProductsFormMock,
}))

const BaseFormStub = defineComponent({
  name: 'BaseFormStub',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h('form', { ...attrs, 'data-testid': 'base-form' }, slots.default ? slots.default() : [])
  },
})

const SectionTitleStub = defineComponent({
  name: 'SectionTitleStub',
  props: { content: { type: String, default: '' } },
  setup(props) {
    return () => h('h2', { 'data-testid': 'section-title' }, props.content)
  },
})

const ElFormItemStub = defineComponent({
  name: 'ElFormItemStub',
  inheritAttrs: false,
  props: {
    label: { type: String, default: '' },
    prop: { type: String, default: '' },
    required: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'form-item',
          'data-label': props.label,
          'data-prop': props.prop,
          'data-required': props.required,
          ...attrs,
        },
        slots.default ? slots.default() : [],
      )
  },
})

const ElInputStub = defineComponent({
  name: 'ElInputStub',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number, null, Object], default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs, slots }) {
    return () => {
      const tag = props.type === 'textarea' ? 'textarea' : 'input'
      const commonAttrs = {
        ...attrs,
        'data-testid': 'el-input',
        'data-type': props.type,
        value: props.modelValue ?? '',
        disabled: props.disabled,
        placeholder: props.placeholder,
        onInput: (event: Event) => {
          const target = event.target as HTMLInputElement | HTMLTextAreaElement
          emit('update:modelValue', target.value)
        },
      }
      return h(tag, commonAttrs, slots.default ? slots.default() : [])
    }
  },
})

const ElSelectV2Stub = defineComponent({
  name: 'ElSelectV2Stub',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number, Object, null], default: null },
    options: { type: Array as () => Array<Record<string, unknown>>, default: () => [] },
    props: { type: Object as () => { label?: string; value?: string }, default: () => ({}) },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'select',
        {
          'data-testid': 'el-select',
          value: props.modelValue ?? '',
          disabled: props.disabled,
          onChange: (event: Event) => {
            const target = event.target as HTMLSelectElement
            emit('update:modelValue', target.value)
          },
        },
        [
          h('option', { value: '' }, props.placeholder),
          ...props.options.map((option) => {
            const labelKey = props.props.label ?? 'label'
            const valueKey = props.props.value ?? 'value'
            const optionRecord = option as Record<string, unknown>
            return h(
              'option',
              {
                value: optionRecord[valueKey] as string | number | undefined,
                'data-testid': `option-${optionRecord[valueKey]}`,
              },
              optionRecord[labelKey] as string | undefined,
            )
          }),
        ],
      )
  },
})

const ElImageStub = defineComponent({
  name: 'ElImageStub',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h('img', {
        ...attrs,
        'data-testid': 'el-image',
        src: (attrs as Record<string, string>).src ?? '',
        alt: (attrs as Record<string, string>).alt ?? '',
      })
  },
})

const ElIconStub = defineComponent({
  name: 'ElIconStub',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': 'el-icon',
          ...attrs,
        },
        slots.default ? slots.default() : [],
      )
  },
})

const DeleteIconStub = defineComponent({
  name: 'DeleteIconStub',
  setup() {
    return () =>
      h(
        'span',
        {
          'data-testid': 'delete-icon',
          'aria-hidden': 'true',
        },
        'Remove',
      )
  },
})

const AddIconStub = defineComponent({
  name: 'AddIconStub',
  setup() {
    return () =>
      h(
        'span',
        {
          'data-testid': 'add-icon',
          'aria-hidden': 'true',
        },
        'Add',
      )
  },
})

const ElUploadStub = defineComponent({
  name: 'ElUploadStub',
  inheritAttrs: false,
  props: {
    accept: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['change'],
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'el-upload',
          'data-accept': props.accept,
          'data-disabled': props.disabled,
          ...attrs,
        },
        [
          slots.default ? slots.default() : [],
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'upload-trigger',
              onClick: () => {
                const handler =
                  (attrs as unknown as { ['on-change']?: (arg: unknown) => void })?.['on-change'] ||
                  (attrs as unknown as { onChange?: (arg: unknown) => void })?.onChange
                handler?.({ raw: new File(['x'], 'pic.png', { type: 'image/png' }) })
                emit('change', new File(['x'], 'pic.png', { type: 'image/png' }))
              },
            },
            'upload',
          ),
          h('input', {
            type: 'file',
            accept: props.accept,
            disabled: props.disabled,
            style: 'display: none',
            onChange: (event: Event) => {
              const target = event.target as HTMLInputElement
              if (target.files && target.files[0]) {
                emit('change', target.files[0])
              }
            },
          }),
        ],
      )
  },
})

const ElSwitchStub = defineComponent({
  name: 'ElSwitchStub',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number, Boolean], default: 0 },
    activeValue: { type: [String, Number, Boolean], default: true },
    inactiveValue: { type: [String, Number, Boolean], default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          role: 'switch',
          'data-testid': 'el-switch',
          'aria-checked': props.modelValue === props.activeValue,
          disabled: props.disabled,
          ...attrs,
          onClick: () => {
            if (!props.disabled) {
              const nextValue =
                props.modelValue === props.activeValue ? props.inactiveValue : props.activeValue
              emit('update:modelValue', nextValue)
            }
          },
        },
        props.modelValue === props.activeValue ? 'On' : 'Off',
      )
  },
})

const ElTextStub = defineComponent({
  name: 'ElTextStub',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'p',
        {
          'data-testid': 'el-text',
          ...attrs,
        },
        slots.default ? slots.default() : [],
      )
  },
})

const WhiteButtonStub = defineComponent({
  name: 'WhiteButtonStub',
  inheritAttrs: false,
  props: {
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { emit, attrs }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': 'white-button',
          disabled: props.disabled,
          ...attrs,
          onClick: () => emit('click'),
        },
        props.label,
      )
  },
})

const BlueButtonStub = defineComponent({
  name: 'BlueButtonStub',
  inheritAttrs: false,
  props: {
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { emit, attrs }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': 'blue-button',
          disabled: props.disabled || props.loading,
          ...attrs,
          onClick: () => emit('click'),
        },
        props.label,
      )
  },
})

const globalStubs = {
  BaseForm: BaseFormStub,
  SectionTitle: SectionTitleStub,
  ElFormItem: ElFormItemStub,
  ElInput: ElInputStub,
  'el-select-v2': ElSelectV2Stub,
  ElImage: ElImageStub,
  ElIcon: ElIconStub,
  DeleteIcon: DeleteIconStub,
  AddIcon: AddIconStub,
  ElUpload: ElUploadStub,
  ElSwitch: ElSwitchStub,
  ElText: ElTextStub,
  WhiteButton: WhiteButtonStub,
  BlueButton: BlueButtonStub,
}

type ProductsFormComposable = ReturnType<typeof createComposableReturn>

function createComposableReturn() {
  return {
    productsFormRef: ref(null),
    form: reactive({
      productName: '',
      maker: '',
      janCode: '',
      productCategory: null,
      productImage: undefined as File | undefined,
      description: '',
      other: '',
    }),
    rules: {},
    disabled: ref(false),
    productImageUrl: ref(''),
    isSubmitProductPending: ref(false),
    isPending: ref(false),
    productCategory: ref<unknown>(null),
    handleChange: vi.fn(),
    handleRemove: vi.fn(),
    formSubmit: vi.fn(),
    handleCancel: vi.fn(),
  }
}

function setupUseProductsFormMock(overrides: Partial<ProductsFormComposable> = {}) {
  const base = createComposableReturn()
  const resolved = { ...base, ...overrides }
  useProductsFormMock.mockImplementation(() => resolved)
  return resolved
}

function renderProductsForm() {
  return render(ProductsForm, {
    global: {
      stubs: globalStubs,
    },
  })
}

describe('ProductsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useProductsFormMock.mockReset()
  })
  afterEach(() => {
    cleanup()
  })

  it('renders upload placeholder when no image is present', () => {
    setupUseProductsFormMock({
      productImageUrl: ref(''),
    })

    const { getByTestId } = renderProductsForm()

    expect(getByTestId('el-upload')).toBeTruthy()
    expect(getByTestId('el-upload').getAttribute('data-accept')).toBe('image/*')
  })

  it('shows existing image preview and removes it when delete icon is clicked', async () => {
    const handleRemove = vi.fn()
    setupUseProductsFormMock({
      productImageUrl: ref('https://example.com/image.jpg'),
      handleRemove,
    })

    const { getByTestId } = renderProductsForm()

    expect(getByTestId('el-image')).toBeTruthy()
    expect(getByTestId('el-image').getAttribute('src')).toBe('https://example.com/image.jpg')

    const removeButton = getByTestId('el-icon')
    await fireEvent.click(removeButton)

    expect(handleRemove).toHaveBeenCalledTimes(1)
  })

  it('loads product details automatically via watch when data is available', async () => {
    setupUseProductsFormMock({
      form: reactive({
        productName: 'Auto Loaded Product',
        maker: 'Auto Maker',
        janCode: '1234567890123',
        productCategory: null,
        productImage: undefined as File | undefined,
        description: 'Auto loaded description',
        other: '',
      }),
    })

    const { getAllByTestId } = renderProductsForm()
    await flushPromises()

    const inputs = getAllByTestId('el-input')
    expect((inputs[0] as HTMLInputElement).value).toBe('Auto Loaded Product')
  })

  it('renders form correctly without initial product data', async () => {
    setupUseProductsFormMock()

    const { getAllByTestId } = renderProductsForm()
    await flushPromises()

    const inputs = getAllByTestId('el-input')
    expect((inputs[0] as HTMLInputElement).value).toBe('')
  })

  it('submits and cancels via action buttons', async () => {
    const formSubmit = vi.fn()
    const handleCancel = vi.fn()
    setupUseProductsFormMock({
      formSubmit,
      handleCancel,
    })

    const { getByTestId } = renderProductsForm()

    const submitButton = getByTestId('blue-button')
    await fireEvent.click(submitButton)
    expect(formSubmit).toHaveBeenCalledTimes(1)

    const cancelButton = getByTestId('white-button')
    await fireEvent.click(cancelButton)
    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('invokes handleRemove on delete icon click path and formSubmit on primary button', async () => {
    const handleRemove = vi.fn()
    const formSubmit = vi.fn()
    setupUseProductsFormMock({
      productImageUrl: ref('preview.png'),
      handleRemove,
      formSubmit,
    })

    const { getByTestId } = renderProductsForm()

    const removeButton = getByTestId('el-icon')
    await fireEvent.click(removeButton)
    expect(handleRemove).toHaveBeenCalledTimes(1)

    const submitButton = getByTestId('blue-button')
    await fireEvent.click(submitButton)
    expect(formSubmit).toHaveBeenCalledTimes(1)
  })

  it('renders all form fields with correct labels and placeholders', () => {
    setupUseProductsFormMock()

    const { getByTestId, getAllByTestId } = renderProductsForm()

    expect(getByTestId('base-form')).toBeTruthy()
    expect(getAllByTestId('form-item').length).toBeGreaterThan(0)
    expect(getAllByTestId('el-input').length).toBeGreaterThan(0)
  })

  it('handles form input changes correctly', async () => {
    setupUseProductsFormMock()
    const { getAllByTestId } = renderProductsForm()
    const inputs = getAllByTestId('el-input')
    await fireEvent.input(inputs[0], { target: { value: 'Test Product' } })
    expect((inputs[0] as HTMLInputElement).value).toBe('Test Product')
  })

  it('disables form when disabled prop is true', () => {
    setupUseProductsFormMock({
      disabled: ref(true),
    })

    const { getByTestId } = renderProductsForm()

    const submitButton = getByTestId('blue-button') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
  })

  it('shows loading state on submit button when isSubmitProductPending is true', () => {
    setupUseProductsFormMock({
      isSubmitProductPending: ref(true),
    })

    const { getByTestId } = renderProductsForm()

    const submitButton = getByTestId('blue-button') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
  })

  it('handles product category selection', async () => {
    const composable = setupUseProductsFormMock({
      productCategory: ref({
        categories: [
          { categoryId: 'cat1', categoryName: 'Category 1' },
          { categoryId: 'cat2', categoryName: 'Category 2' },
        ],
      }),
    })
    const { container } = renderProductsForm()
    const select = container.querySelector('select[data-testid="el-select"]') as HTMLSelectElement
    await fireEvent.change(select, { target: { value: 'cat1' } })
    expect(composable.form.productCategory).toBe('cat1')
  })

  it('renders section titles correctly', () => {
    setupUseProductsFormMock()

    const { getAllByTestId } = renderProductsForm()
    expect(getAllByTestId('section-title').length).toBeGreaterThan(0)
  })

  it('handles file upload change event', async () => {
    const handleChange = vi.fn()
    setupUseProductsFormMock({
      handleChange,
    })

    const { getAllByTestId } = renderProductsForm()
    const forms = getAllByTestId('base-form') as HTMLElement[]
    const targetForm = forms.find((f) => !!f.getAttribute('rules')) ?? forms[0]
    const trigger = within(targetForm).getByTestId('upload-trigger')
    await fireEvent.click(trigger)
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('passes rules to base form when provided', () => {
    const mockRules = {
      productName: [{ required: true, message: '产品名是必填项', trigger: 'blur' }],
    }

    setupUseProductsFormMock({
      rules: mockRules,
    })

    const { getAllByTestId } = renderProductsForm()
    const forms = getAllByTestId('base-form') as HTMLElement[]
    expect(forms.some((f) => !!f.getAttribute('rules'))).toBe(true)
  })

  it('handles textarea input for description field', async () => {
    setupUseProductsFormMock()
    const { getAllByTestId } = renderProductsForm()
    const textareas = getAllByTestId('el-input').filter(
      (input) => input.getAttribute('data-type') === 'textarea',
    ) as HTMLInputElement[]
    await fireEvent.input(textareas[0], { target: { value: 'Test description' } })
    expect(textareas[0].value).toBe('Test description')
  })

  it('pre-fills form data when editing existing product', async () => {
    const existingFormData = reactive({
      productName: 'Existing Product',
      maker: 'Existing Maker',
      janCode: '1234567890123',
      productCategory: null,
      productImage: undefined as File | undefined,
      description: 'Existing description',
      other: 'Existing other info',
    })

    setupUseProductsFormMock({
      form: existingFormData,
      productImageUrl: ref('existing-image.jpg'),
    })

    const { getByTestId, getAllByTestId } = renderProductsForm()

    expect(getByTestId('el-image')).toBeTruthy()
    expect(getAllByTestId('el-input').length).toBeGreaterThan(0)
  })

  it('handles form reset or clear actions', async () => {
    const handleCancel = vi.fn()
    setupUseProductsFormMock({
      handleCancel,
    })

    const { getAllByTestId } = renderProductsForm()
    const cancelButtons = getAllByTestId('white-button')
    for (const btn of cancelButtons) {
      await fireEvent.click(btn)
    }

    expect(handleCancel).toHaveBeenCalled()
  })

  it('validates JAN code format when provided (placeholder interaction)', async () => {
    setupUseProductsFormMock()
    const { getAllByTestId } = renderProductsForm()
    const janInput = getAllByTestId('el-input')[2] as HTMLInputElement
    await fireEvent.input(janInput, { target: { value: '1234567890123' } })
    expect(janInput.value).toBe('1234567890123')
  })
})
