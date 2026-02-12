import { watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { SortOrder } from '@/enum'
import { getCustomerList } from '@/api/customers'

export const useCustomerListApi = (
  params: {
    offset: Ref<number>
    query: Ref<string>
    sortKey: Ref<string>
    sortOrder: Ref<SortOrder>
    status?: Ref<string | undefined>
  },
  page: Ref<number>,
) => {
  const { data: customerList, isFetching: isLoading } = useQuery({
    queryKey: [
      'customerList',
      params.offset,
      params.query,
      params.sortKey,
      params.sortOrder,
      params.status,
    ],
    queryFn: () =>
      getCustomerList({
        offset: params.offset.value,
        query: params.query.value,
        sortKey: params.sortKey.value,
        sortOrder: params.sortOrder.value,
        ...(params.status?.value && {
          status: params.status.value,
        }),
      }),
    placeholderData: (prev) => prev,
  })

  watch([params.query, params.sortKey, params.sortOrder, params.status], () => {
    page.value = 1
  })

  return {
    customerList,
    isLoading,
  }
}
