import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useCustomerDetailApi } from '@/hooks/useCustomerDetailApi'
import message from '@/enum/message.json'
import { useCommentListApi } from '@/hooks/useCommentListApi'
import { useCommentDisplayStatusApi } from '@/hooks/useCommentDisplayStatusApi'
import { CommentSortKey, CommentType, pageSize, SortOrder } from '@/enum'
import { useDebouncedRef } from '@/hooks/useDebouncedRef'

export const useCustomerDetailPage = () => {
  const route = useRoute()
  const userId = computed(() => {
    const id = Number(route.params.id)
    return isNaN(id) ? 0 : id
  })
  const { customerDetail, isLoading: isLoadingDetail } = useCustomerDetailApi(userId)
  const { updateDisplayStatus } = useCommentDisplayStatusApi()

  const isEmpty = computed(() => {
    return !isLoadingDetail.value && !customerDetail.value
  })

  const page = ref(1)
  const searchKeyword = ref('')
  const debouncedQuery = useDebouncedRef(searchKeyword)
  const activeTab = ref('all')
  const sortField = ref<CommentSortKey>(CommentSortKey.ReviewId)
  const sortOrder = ref<SortOrder>(SortOrder.Desc)
  const limit = ref(pageSize)
  const commentType = computed(() =>
    activeTab.value === 'hidden' ? CommentType.Hidden : CommentType.All,
  )

  const offset = computed(() => (page.value - 1) * pageSize)

  const {
    commentList,
    isLoading: isLoadingComments,
    refetch: refetchComments,
  } = useCommentListApi(
    {
      query: debouncedQuery,
      userId,
      offset,
      limit,
      commentType,
      sortKey: sortField,
      sortOrder,
    },
    page,
  )

  const pageChange = (newPage: number) => {
    page.value = newPage
  }

  watch(debouncedQuery, () => {
    page.value = 1
  })

  watch(activeTab, () => {
    page.value = 1
  })

  const handleHideAllComments = async () => {
    await updateDisplayStatus({
      idType: 'user',
      targetId: Number(userId.value),
      displayFlag: 0,
    })
    ElMessage.success(message.comment.hideAllSuccess)
    refetchComments()
  }

  const tabs = [
    { label: 'すべて', name: 'all' },
    { label: '非表示コメント', name: 'hidden' },
  ]

  return {
    customerDetail,
    commentList,
    isLoadingDetail,
    isLoadingComments,
    isLoading: computed(() => isLoadingDetail.value && isLoadingComments.value),
    isEmpty,
    page,
    searchKeyword,
    activeTab,
    sortField,
    sortOrder,
    pageChange,
    handleHideAllComments,
    tabs,
  }
}
