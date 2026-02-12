import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import type { Comment } from '@/api/types/comments'
import message from '@/enum/message.json'
import { useCommentCheckStatusApi } from '@/hooks/useCommentCheckStatusApi'
import { useCommentDisplayStatusApi } from '@/hooks/useCommentDisplayStatusApi'
import { routeNames } from '@/router/routes'

export const useCommentsTable = () => {
  const router = useRouter()
  const { updateCheckStatus } = useCommentCheckStatusApi()
  const { updateDisplayStatus } = useCommentDisplayStatusApi()

  const getIsChecked = (row: Comment): boolean => {
    return row.checkFlag === 1
  }

  const getIsVisible = (row: Comment): boolean => {
    return row.displayFlag === 1
  }

  const loadingRowIds = ref<Set<number>>(new Set())
  const loadingDisplayRowIds = ref<Set<number>>(new Set())

  const handleCheckChange = async (row: Comment) => {
    if (loadingRowIds.value.has(row.reviewId)) return

    const newChecked = !getIsChecked(row)
    loadingRowIds.value.add(row.reviewId)

    await updateCheckStatus({
      reviewIdList: [row.reviewId],
      checkFlag: newChecked ? 1 : 0,
    })

    row.checkFlag = newChecked ? 1 : 0
    ElMessage.success(message.comment.checkSuccess)

    loadingRowIds.value.delete(row.reviewId)
  }

  const handleVisibleChange = async (row: Comment, val: string | number | boolean) => {
    if (loadingDisplayRowIds.value.has(row.reviewId)) return

    const boolVal = Boolean(val)
    const newDisplayFlag = boolVal ? 1 : 0
    loadingDisplayRowIds.value.add(row.reviewId)

    await updateDisplayStatus({
      idType: 'comment',
      targetId: row.reviewId,
      displayFlag: newDisplayFlag,
    })

    row.displayFlag = newDisplayFlag
    ElMessage.success(message.comment.displaySuccess)

    loadingDisplayRowIds.value.delete(row.reviewId)
  }

  const handleCommentClick = (reviewId: number) => {
    router.push({
      name: routeNames.comments.detail,
      params: {
        id: reviewId,
      },
    })
  }

  const handleProjectClick = (projectId: number) => {
    router.push({
      name: routeNames.projects.detail,
      params: {
        id: projectId,
      },
    })
  }

  const handleCustomerClick = (userId: number) => {
    router.push({
      name: routeNames.customers.detail,
      params: {
        id: userId,
      },
    })
  }

  return {
    getIsChecked,
    getIsVisible,
    handleCheckChange,
    handleVisibleChange,
    handleCommentClick,
    handleProjectClick,
    handleCustomerClick,
    loadingRowIds,
    loadingDisplayRowIds,
  }
}
