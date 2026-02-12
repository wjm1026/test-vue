// generated-by: ai-assist v1.0
// type: unit
// description: CommentReplyDialog tests ensuring edit vs preview modes render correctly and emit events.

import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { defineComponent, h } from 'vue'

import CommentReplyDialog from '@/components/view/comments/CommentReplyDialog.vue'

const BaseDialogStub = defineComponent({
  name: 'BaseDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    dialogTitle: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'base-dialog',
          'data-visible': String(props.modelValue),
          'data-title': props.dialogTitle,
        },
        [
          slots.main ? slots.main() : null,
          h(
            'button',
            {
              'data-testid': 'base-dialog-close',
              onClick: () => emit('close'),
            },
            'close',
          ),
        ],
      )
  },
})

const BaseFormStub = defineComponent({
  name: 'BaseForm',
  setup(_, { slots }) {
    return () => h('form', { 'data-testid': 'base-form' }, slots.default ? slots.default() : [])
  },
})

const ElFormItemStub = defineComponent({
  name: 'ElFormItem',
  setup(_, { slots }) {
    return () => h('div', { 'data-testid': 'el-form-item' }, slots.default ? slots.default() : [])
  },
})

const ElInputStub = defineComponent({
  name: 'ElInput',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('textarea', {
        'data-testid': 'comment-input',
        value: props.modelValue,
        placeholder: props.placeholder,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLTextAreaElement).value),
      })
  },
})

const WhiteButtonStub = defineComponent({
  name: 'WhiteButton',
  props: {
    label: { type: String, required: true },
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          'data-testid': `white-button-${props.label}`,
          onClick: () => emit('click'),
        },
        props.label,
      )
  },
})

const BlueButtonStub = defineComponent({
  name: 'BlueButton',
  props: {
    label: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          'data-testid': `blue-button-${props.label}`,
          'data-disabled': String(props.disabled),
          'data-loading': String(props.loading),
          disabled: props.disabled,
          onClick: () => emit('click'),
        },
        props.label,
      )
  },
})

const ElTextStub = defineComponent({
  name: 'ElText',
  setup(_, { slots }) {
    return () => h('p', { 'data-testid': 'el-text' }, slots.default ? slots.default() : [])
  },
})

const globalStubs = {
  BaseDialog: BaseDialogStub,
  BaseForm: BaseFormStub,
  ElFormItem: ElFormItemStub,
  ElInput: ElInputStub,
  WhiteButton: WhiteButtonStub,
  BlueButton: BlueButtonStub,
  ElText: ElTextStub,
}

describe('CommentReplyDialog', () => {
  it('renders form, disables submit for blank input, and emits submit/close events', async () => {
    // Purpose: ensure form interaction works and events propagate.
    const view = render(CommentReplyDialog, {
      props: {
        modelValue: true,
        isPending: false,
        initialReply: '',
      },
      global: { stubs: globalStubs },
    })

    const sendBtn = view.getByTestId('blue-button-送信する')
    expect(sendBtn.getAttribute('data-disabled')).toBe('true')

    await fireEvent.update(view.getByTestId('comment-input'), '返信内容')

    expect(sendBtn.getAttribute('data-disabled')).toBe('false')

    await fireEvent.click(sendBtn)
    expect(view.emitted().commentReplySubmit).toEqual([['返信内容']])

    await fireEvent.click(view.getByTestId('white-button-キャンセル'))
    expect(view.emitted().closeDialog).toHaveLength(1)
    expect(view.emitted()['update:modelValue']).toEqual([[false]])
  })

  it('pre-fills form with initial reply and shows loading state', async () => {
    // Purpose: verify initial reply is populated and loading state works.
    const view = render(CommentReplyDialog, {
      props: {
        modelValue: true,
        isPending: true,
        initialReply: '既存の返信',
      },
      global: { stubs: globalStubs },
    })

    const input = view.getByTestId('comment-input')
    expect((input as HTMLTextAreaElement).value).toBe('既存の返信')

    const sendBtn = view.getByTestId('blue-button-送信する')
    expect(sendBtn.getAttribute('data-loading')).toBe('true')
    expect(sendBtn.getAttribute('data-disabled')).toBe('false')
  })

  it('disables submit button when input is empty or whitespace only', async () => {
    // Purpose: verify submit button is disabled for empty or whitespace-only input.
    const view = render(CommentReplyDialog, {
      props: {
        modelValue: true,
        isPending: false,
        initialReply: '',
      },
      global: { stubs: globalStubs },
    })

    const sendBtn = view.getByTestId('blue-button-送信する')
    expect(sendBtn.getAttribute('data-disabled')).toBe('true')

    await fireEvent.update(view.getByTestId('comment-input'), '   ')
    expect(sendBtn.getAttribute('data-disabled')).toBe('true')

    await fireEvent.update(view.getByTestId('comment-input'), 'Valid reply')
    expect(sendBtn.getAttribute('data-disabled')).toBe('false')
  })

  it('enables submit button when input has content', async () => {
    // Purpose: verify submit button is enabled when input has non-whitespace content.
    const view = render(CommentReplyDialog, {
      props: {
        modelValue: true,
        isPending: false,
        initialReply: '',
      },
      global: { stubs: globalStubs },
    })

    const sendBtn = view.getByTestId('blue-button-送信する')
    await fireEvent.update(view.getByTestId('comment-input'), 'Valid reply text')

    expect(sendBtn.getAttribute('data-disabled')).toBe('false')
  })

  it('closes dialog when cancel button is clicked', async () => {
    // Purpose: verify cancel button closes the dialog.
    const view = render(CommentReplyDialog, {
      props: {
        modelValue: true,
        isPending: false,
        initialReply: '',
      },
      global: { stubs: globalStubs },
    })

    await fireEvent.click(view.getByTestId('white-button-キャンセル'))

    expect(view.emitted().closeDialog).toHaveLength(1)
    expect(view.emitted()['update:modelValue']).toEqual([[false]])
  })

  it('closes dialog when BaseDialog close event is triggered', async () => {
    // Purpose: verify BaseDialog close event closes the dialog.
    const view = render(CommentReplyDialog, {
      props: {
        modelValue: true,
        isPending: false,
        initialReply: '',
      },
      global: { stubs: globalStubs },
    })

    await fireEvent.click(view.getByTestId('base-dialog-close'))

    expect(view.emitted()['update:modelValue']).toEqual([[false]])
  })

  it('renders dialog with correct title', () => {
    // Purpose: verify dialog title is displayed correctly.
    const view = render(CommentReplyDialog, {
      props: {
        modelValue: true,
        isPending: false,
        initialReply: '',
      },
      global: { stubs: globalStubs },
    })

    expect(view.getByTestId('base-dialog').getAttribute('data-title')).toBe('コメント返信')
  })

  it('updates form value when input changes', async () => {
    // Purpose: verify form input binding updates commentReply value.
    const view = render(CommentReplyDialog, {
      props: {
        modelValue: true,
        isPending: false,
        initialReply: '',
      },
      global: { stubs: globalStubs },
    })

    const input = view.getByTestId('comment-input') as HTMLTextAreaElement
    await fireEvent.update(input, 'New reply content')

    expect(input.value).toBe('New reply content')
  })

  it('disables submit button when isPending is true', () => {
    // Purpose: verify submit button is disabled during pending state.
    const view = render(CommentReplyDialog, {
      props: {
        modelValue: true,
        isPending: true,
        initialReply: 'Existing reply',
      },
      global: { stubs: globalStubs },
    })

    const sendBtn = view.getByTestId('blue-button-送信する')
    expect(sendBtn.getAttribute('data-loading')).toBe('true')
  })
})
