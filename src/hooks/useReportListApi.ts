import { useQuery } from '@tanstack/vue-query'
import { watch, type Ref } from 'vue'

import { getReportList } from '@/api/reports'
import type { SortOrder } from '@/enum'

export const useReportListApi = (
  params: {
    offset: Ref<number>
    query: Ref<string>
    sortKey: Ref<string>
    sortOrder: Ref<SortOrder>
    startDate: Ref<string>
    endDate: Ref<string>
  },
  page: Ref<number>,
) => {
  const { data: reportList, isFetching: isLoading } = useQuery({
    queryKey: [
      'reportList',
      params.offset,
      params.query,
      params.sortKey,
      params.sortOrder,
      params.startDate,
      params.endDate,
    ],
    queryFn: () =>
      getReportList({
        offset: params.offset.value,
        query: params.query.value,
        sortKey: params.sortKey.value,
        sortOrder: params.sortOrder.value,
        startDate: params.startDate.value || undefined,
        endDate: params.endDate.value || undefined,
      }),
    placeholderData: (prev) => prev,
  })

  watch([params.query, params.sortKey, params.sortOrder, params.startDate, params.endDate], () => {
    page.value = 1
  })

  return {
    reportList,
    isLoading,
  }
}
