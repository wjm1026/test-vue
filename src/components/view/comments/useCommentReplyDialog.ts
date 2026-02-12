import { computed, ref, watch } from 'vue'

interface CommentReplyDialogProps {
  modelValue: boolean
  isPending: boolean
  initialReply?: string
}
interface CommentReplyDialogEmit {
  (event: 'update:modelValue', value: boolean): void
  (event: 'closeDialog'): void
  (event: 'commentReplySubmit', commentReply: string): void
}

export const useCommentReplyDialog = (
  props: CommentReplyDialogProps,
  emit: CommentReplyDialogEmit,
) => {
  const visible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  const form = ref({
    commentReply: props.modelValue ? props.initialReply || '' : '',
  })
  watch(
    () => props.modelValue,
    (newVal) => {
      form.value.commentReply = newVal ? props.initialReply || '' : ''
    },
  )

  const CommentReplySubmit = () => {
    emit('commentReplySubmit', form.value.commentReply)
  }
  const closeDialog = () => {
    visible.value = false
    emit('closeDialog')
  }

  return {
    form,
    visible,
    CommentReplySubmit,
    closeDialog,
  }
}

export type { CommentReplyDialogProps, CommentReplyDialogEmit }
