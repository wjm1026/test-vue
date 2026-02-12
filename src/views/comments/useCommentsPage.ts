import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

import { pageSize, SortOrder } from '@/enum'
import message from '@/enum/message.json'
import { useCommentListApi } from '@/hooks/useCommentListApi'
import { useDebouncedRef } from '@/hooks/useDebouncedRef'
import {
  mapTabToExtractType,
  mapFiltersToCommentType,
  mapSortFieldToSortKey,
} from '@/api/types/comments'
import { useCommentCheckStatusApi } from '@/hooks/useCommentCheckStatusApi'
import { useCommentListCSVDownload } from '@/hooks/useCommentListCSVDownload'

export const useCommentsPage = () => {
  const searchKeyword = ref('')
  const debouncedQuery = useDebouncedRef(searchKeyword)
  const activeTab = ref('all')
  const filterList = ref<string[]>(['visible', 'hidden'])
  const page = ref(1)
  const limit = ref(pageSize)
  const sortField = ref('')
  const sortOrder = ref<SortOrder>(SortOrder.Desc)
  const offset = computed(() => (page.value - 1) * limit.value)
  const extractType = computed(() => mapTabToExtractType(activeTab.value))
  const commentType = computed(() => mapFiltersToCommentType(filterList.value))
  const sortKey = computed(() =>
    sortField.value ? mapSortFieldToSortKey(sortField.value) : undefined,
  )

  const { updateCheckStatus } = useCommentCheckStatusApi()
  const { isDownloading, downloadCSV } = useCommentListCSVDownload()

  const { commentList, isLoading } = useCommentListApi(
    {
      offset,
      query: debouncedQuery,
      limit,
      extractType,
      commentType,
      sortKey,
      sortOrder,
    },
    page,
  )

  const pageChange = (newPage: number) => {
    page.value = newPage
  }

  watch(
    [debouncedQuery, activeTab, filterList],
    () => {
      page.value = 1
    },
    { deep: true },
  )

  const handleCSVDownload = async () => {
    await downloadCSV({
      query: searchKeyword.value || undefined,
      extractType: extractType.value,
      commentType: commentType.value,
      sortKey: sortKey.value,
      sortOrder: sortOrder.value,
    })
  }

  const isAllChecked = computed(() => {
    if (!commentList.value?.comments || commentList.value.comments.length === 0) {
      return false
    }
    return commentList.value.comments.every((comment) => comment.checkFlag === 1)
  })

  const isCheckAllLoading = ref(false)

  const toggleCheckAll = async () => {
    if (!commentList.value?.comments || isCheckAllLoading.value) return

    const comments = commentList.value.comments
    const shouldCheckAll = !isAllChecked.value

    isCheckAllLoading.value = true
    await updateCheckStatus({
      reviewIdList: comments.map((comment) => comment.reviewId),
      checkFlag: shouldCheckAll ? 1 : 0,
    })

    comments.forEach((comment) => {
      comment.checkFlag = shouldCheckAll ? 1 : 0
    })
    ElMessage.success(message.comment.checkSuccess)
    isCheckAllLoading.value = false
  }

  const checkAllButtonLabel = computed(() => {
    return isAllChecked.value
      ? 'このページのチェックを全て解除'
      : 'このページ全てチェック済みにする'
  })

  return {
    searchKeyword,
    activeTab,
    filterList,
    commentList,
    isLoading,
    page,
    sortField,
    sortOrder,
    pageChange,
    handleCSVDownload,
    toggleCheckAll,
    checkAllButtonLabel,
    isCheckAllLoading,
    isDownloading,
  }
}
