import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'

import { getCommentDetail } from '@/api/comments'

export const useCommentDetailApi = (reviewId: Ref<number>) => {
  const {
    data: commentDetail,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['commentDetail', reviewId],
    queryFn: () => getCommentDetail(reviewId.value),
    enabled: () => reviewId.value > 0,
  })

  return {
    commentDetail,
    isLoading: isFetching,
    refetch,
  }
}
