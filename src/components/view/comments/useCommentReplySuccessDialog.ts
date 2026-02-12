import { computed } from 'vue'

interface CommentReplySuccessDialogProps {
  modelValue: boolean
  replyContent?: string
}
interface CommentReplySuccessDialogEmit {
  (event: 'update:modelValue', value: boolean): void
  (event: 'closeDialog'): void
}

export const useCommentReplySuccessDialog = (
  props: CommentReplySuccessDialogProps,
  emit: CommentReplySuccessDialogEmit,
) => {
  const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  const closeDialog = () => {
    visible.value = false
    emit('closeDialog')
  }

  return {
    visible,
    closeDialog,
  }
}

export type { CommentReplySuccessDialogProps, CommentReplySuccessDialogEmit }
