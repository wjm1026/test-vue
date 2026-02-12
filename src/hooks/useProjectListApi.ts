import { watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getProjectList } from '@/api'
import { SortOrder } from '@/enum'

export const useProjectListApi = (
  params: {
    offset: Ref<number>
    query: Ref<string>
    sortKey: Ref<string>
    sortOrder: Ref<SortOrder>
  },
  page: Ref<number>,
) => {
  const { data: projectList, isFetching: isLoading } = useQuery({
    queryKey: ['projectList', params.offset, params.query, params.sortKey, params.sortOrder],
    queryFn: () =>
      getProjectList({
        offset: params.offset.value,
        query: params.query.value,
        sortKey: params.sortKey.value,
        sortOrder: params.sortOrder.value,
      }),
    placeholderData: (prev) => prev,
  })

  watch([params.query, params.sortKey, params.sortOrder], () => {
    page.value = 1
  })

  return {
    projectList,
    isLoading,
  }
}
