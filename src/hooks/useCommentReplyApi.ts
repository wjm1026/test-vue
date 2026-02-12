import { useMutation } from '@tanstack/vue-query'

import { submitCommentReply } from '@/api/comments'

export const useCommentReplyApi = () => {
  const { mutateAsync: submitReply } = useMutation({
    mutationFn: submitCommentReply,
  })

  return {
    submitReply,
  }
}
