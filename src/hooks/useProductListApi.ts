import { watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { SortOrder } from '@/enum'
import { getProducts } from '@/api/products'

export const useProductListApi = (
  params: {
    offset: Ref<number>
    query: Ref<string>
    sortKey: Ref<string>
    sortOrder: Ref<SortOrder>
  },
  page: Ref<number>,
) => {
  const { data: productList, isFetching: isLoading } = useQuery({
    queryKey: ['productList', params.offset, params.query, params.sortKey, params.sortOrder],
    queryFn: () =>
      getProducts({
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
    productList,
    isLoading,
  }
}
