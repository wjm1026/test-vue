import { useMutation } from '@tanstack/vue-query'

import { deleteCommentReply } from '@/api/comments'

export const useCommentReplyDeleteApi = () => {
  const { mutateAsync: deleteReply, isPending: isDeleteLoading } = useMutation({
    mutationFn: deleteCommentReply,
  })

  return {
    deleteReply,
    isDeleteLoading,
  }
}
