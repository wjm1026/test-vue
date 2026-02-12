import { useMutation } from '@tanstack/vue-query'

import { updateCommentCheckStatus } from '@/api/comments'

export const useCommentCheckStatusApi = () => {
  const { mutateAsync: updateCheckStatus } = useMutation({
    mutationFn: updateCommentCheckStatus,
  })

  return {
    updateCheckStatus,
  }
}
