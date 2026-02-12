import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getProductDetail } from '@/api/products'

export const useProductsDetailApi = (janCode: Ref<string>) => {
  const {
    data: productDetail,
    isFetching,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: ['productDetail', janCode],
    queryFn: () =>
      getProductDetail({
        janCode: janCode.value,
      }),
    enabled: computed(() => !!janCode.value),
    placeholderData: (prev) => prev,
  })

  return {
    productDetail,
    isFetching,
    refetchDetail,
  }
}
