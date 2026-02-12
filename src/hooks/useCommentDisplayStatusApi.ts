import { useMutation } from '@tanstack/vue-query'

import { updateCommentDisplayStatus } from '@/api/comments'

export const useCommentDisplayStatusApi = () => {
  const { mutateAsync: updateDisplayStatus } = useMutation({
    mutationFn: updateCommentDisplayStatus,
  })

  return {
    updateDisplayStatus,
  }
}
