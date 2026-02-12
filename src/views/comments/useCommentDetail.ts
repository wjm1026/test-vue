import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import message from '@/enum/message.json'
import { useCommentDetailApi } from '@/hooks/useCommentDetailApi'
import { useCommentReplyApi } from '@/hooks/useCommentReplyApi'
import { useCommentReplyDeleteApi } from '@/hooks/useCommentReplyDeleteApi'
import { routeNames } from '@/router/routes'
import { ResultCodeEnum } from '@/enum'

export const useCommentDetail = () => {
  const route = useRoute()
  const router = useRouter()
  const isPending = ref(false)
  const commentReplyVisible = ref(false)
  const commentReplySuccessVisible = ref(false)
  const submittedReplyContent = ref('')

  const reviewId = computed(() => {
    const id = route.params.id as string
    const numId = parseInt(id, 10)
    return isNaN(numId) ? 0 : numId
  })

  const { commentDetail, isLoading, refetch } = useCommentDetailApi(reviewId)

  const isEmpty = computed(() => {
    return !isLoading.value && !commentDetail.value
  })

  const { submitReply } = useCommentReplyApi()
  const { deleteReply, isDeleteLoading } = useCommentReplyDeleteApi()

  const isReply = computed(() => {
    const reply = commentDetail.value?.reply
    return !!(reply && reply.trim())
  })

  const handleReply = () => {
    commentReplyVisible.value = true
  }

  const handleCloseDialog = () => {
    commentReplyVisible.value = false
  }

  const handleCloseSuccessDialog = () => {
    commentReplySuccessVisible.value = false
    submittedReplyContent.value = ''
  }

  const handleSubmitReply = async (value: string) => {
    if (!reviewId.value) return

    isPending.value = true
    const res = await submitReply({
      reviewId: reviewId.value,
      reply: value,
    })

    commentReplyVisible.value = false
    submittedReplyContent.value = res.reply
    commentReplySuccessVisible.value = true
    await refetch()
    isPending.value = false
  }

  const handleDeleteReply = async () => {
    if (!reviewId.value) return

    const response = await deleteReply({
      reviewId: reviewId.value,
    })
    if (response.resultCode === ResultCodeEnum.Success) {
      ElMessage.success(message.comment.replyDeleteSuccess)
      await refetch()
    }
  }

  const handleProjectClick = () => {
    if (commentDetail.value?.projectId) {
      router.push({
        name: routeNames.projects.detail,
        params: { id: String(commentDetail.value.projectId) },
      })
    }
  }

  const handleCustomerClick = () => {
    if (commentDetail.value?.userId) {
      router.push({
        name: routeNames.customers.detail,
        params: {
          id: String(commentDetail.value.userId),
        },
      })
    }
  }

  return {
    commentDetail,
    isLoading,
    isEmpty,
    commentReplyVisible,
    commentReplySuccessVisible,
    submittedReplyContent,
    isReply,
    isPending,
    isDeleteLoading,
    handleReply,
    handleSubmitReply,
    handleDeleteReply,
    handleCloseDialog,
    handleCloseSuccessDialog,
    handleProjectClick,
    handleCustomerClick,
  }
}
