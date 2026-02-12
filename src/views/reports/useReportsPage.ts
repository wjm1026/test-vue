import { computed, ref } from 'vue'
import dayjs from 'dayjs'

import { SortOrder, defaultPage, pageSize } from '@/enum'
import { useReportListApi } from '@/hooks/useReportListApi'
import { useDebouncedRef } from '@/hooks/useDebouncedRef'
import { formatDate } from '@/util/date-format'

export const useReportsPage = () => {
  const searchKeyword = ref('')
  const debouncedQuery = useDebouncedRef(searchKeyword)
  const startDate = ref('')
  const endDate = ref('')
  const sortField = ref('')
  const sortOrder = ref<SortOrder>(SortOrder.Asc)
  const page = ref(defaultPage)

  const offset = computed(() => (page.value - 1) * pageSize)

  const formattedStartDate = computed(() =>
    startDate.value ? formatDate(startDate.value, 'YYYY-MM-DD') : '',
  )
  const formattedEndDate = computed(() =>
    endDate.value ? formatDate(endDate.value, 'YYYY-MM-DD') : '',
  )

  const { reportList, isLoading } = useReportListApi(
    {
      offset: offset,
      query: debouncedQuery,
      sortKey: sortField,
      sortOrder: sortOrder,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    },
    page,
  )

  const pageChange = (newPage: number) => {
    page.value = newPage
  }

  const disableStartDate = (date: Date) => {
    if (!endDate.value) return false
    return dayjs(date).isAfter(dayjs(endDate.value), 'day')
  }

  const disableEndDate = (date: Date) => {
    if (!startDate.value) return false
    return dayjs(date).isBefore(dayjs(startDate.value), 'day')
  }

  return {
    searchKeyword,
    startDate,
    endDate,
    sortField,
    sortOrder,
    reportList,
    isLoading,
    pageChange,
    disableStartDate,
    disableEndDate,
  }
}
