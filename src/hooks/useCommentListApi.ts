import { watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getCommentsList } from '@/api/comments'
import { CommentExtractType, CommentRating, CommentSortKey, CommentType, SortOrder } from '@/enum'

export const useCommentListApi = (
  params: {
    query: Ref<string>
    userId?: Ref<number>
    keyword?: Ref<string>
    extractType?: Ref<CommentExtractType | undefined>
    commentType?: Ref<CommentType | undefined>
    rating?: Ref<CommentRating | undefined>
    sortKey?: Ref<CommentSortKey | undefined>
    sortOrder?: Ref<SortOrder>
    offset: Ref<number>
    limit: Ref<number>
  },
  page: Ref<number>,
) => {
  const {
    data: commentList,
    isFetching: isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      'commentList',
      params.offset,
      params.query,
      params.userId,
      params.keyword,
      params.extractType,
      params.commentType,
      params.rating,
      params.sortKey,
      params.sortOrder,
    ],
    queryFn: () =>
      getCommentsList({
        offset: params.offset.value,
        query: params.query.value,
        userId: params.userId?.value,
        keyword: params.keyword?.value,
        extractType: params.extractType?.value,
        commentType: params.commentType?.value,
        rating: params.rating?.value,
        sortKey: params.sortKey?.value,
        sortOrder: params.sortOrder?.value,
        limit: params.limit.value,
      }),
    placeholderData: (prev) => prev,
  })

  watch(params.query, () => {
    page.value = 1
  })

  return {
    commentList,
    isLoading,
    refetch,
  }
}
