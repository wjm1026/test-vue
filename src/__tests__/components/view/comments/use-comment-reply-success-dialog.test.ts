// generated-by: ai-assist v1.0
// type: unit
// description: Tests for useCommentReplySuccessDialog computed visibility + events.

import { describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'

import {
  useCommentReplySuccessDialog,
  type CommentReplySuccessDialogEmit,
  type CommentReplySuccessDialogProps,
} from '@/components/view/comments/useCommentReplySuccessDialog'

const createEmit = () => {
  const mock = vi.fn()
  const emit: CommentReplySuccessDialogEmit = ((event: string, value?: boolean) =>
    mock(event, value)) as CommentReplySuccessDialogEmit
  return { emit, mock }
}

describe('useCommentReplySuccessDialog', () => {
  it('derives visible state from props and emits update when setter runs', async () => {
    const props = reactive<CommentReplySuccessDialogProps>({
      modelValue: true,
      replyContent: 'Thanks for your feedback',
    })
    const { emit, mock } = createEmit()
    const { visible } = useCommentReplySuccessDialog(props, emit)

    expect(visible.value).toBe(true)

    props.modelValue = false
    await nextTick()
    expect(visible.value).toBe(false)

    visible.value = true
    expect(mock).toHaveBeenLastCalledWith('update:modelValue', true)
  })

  it('closeDialog hides the dialog and emits close event', async () => {
    const props = reactive<CommentReplySuccessDialogProps>({
      modelValue: true,
    })
    const { emit, mock } = createEmit()
    const { closeDialog } = useCommentReplySuccessDialog(props, emit)

    closeDialog()

    expect(mock).toHaveBeenCalledWith('update:modelValue', false)
    expect(mock).toHaveBeenCalledWith('closeDialog', undefined)
  })
})
