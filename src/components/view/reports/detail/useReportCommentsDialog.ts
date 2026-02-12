import { computed, ref, watch } from 'vue'

import { CommentRating, defaultPage } from '@/enum'
import { useCommentListApi } from '@/hooks/useCommentListApi'
import { useDebouncedRef } from '@/hooks/useDebouncedRef'

export const All = 'all' as const

export const useReportCommentsDialog = (
  props: { modelValue: boolean; rating?: CommentRating; projectId?: number },
  emit: { (event: 'closeComments'): void },
) => {
  const searchKeyword = ref<string>('')
  const debouncedQuery = useDebouncedRef(searchKeyword)
  const rating = ref<CommentRating | typeof All>(props.rating ?? All)
  const page = ref(defaultPage)
  const limit = ref(6)
  const commentVisible = ref(false)

  const query = computed(() => (props.projectId ? `${props.projectId}` : ''))
  const offset = computed(() => (page.value - 1) * limit.value)

  const { commentList: rawCommentList, isLoading } = useCommentListApi(
    {
      offset,
      query,
      keyword: debouncedQuery,
      rating: computed(() => (rating.value === All ? undefined : rating.value)),
      limit,
    },
    page,
  )

  const commentList = computed(() => {
    if (!rawCommentList.value) return undefined

    return {
      totalCount: rawCommentList.value.totalCount,
      comments: rawCommentList.value.comments.map((comment) => ({
        reviewId: comment.reviewId,
        label: [comment.ageGroup, comment.gender].filter(Boolean).join(' '),
        content: comment.comment,
        likes: comment.likeCount,
        userIconIndex: comment.userIconIndex,
      })),
    }
  })

  watch(debouncedQuery, () => {
    page.value = 1
  })

  watch(
    rating,
    () => {
      page.value = 1
    },
    { deep: true },
  )

  const pageChange = (value: number) => {
    page.value = value
  }

  const handleClose = () => {
    commentVisible.value = false
    emit('closeComments')
  }

  watch(
    () => props.modelValue,
    (visible) => {
      commentVisible.value = visible
    },
    {
      immediate: true,
    },
  )

  return {
    commentVisible,
    searchKeyword,
    rating,
    commentList,
    isLoading,
    page,
    limit,
    pageChange,
    handleClose,
  }
}
