import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getCustomerDetail } from '@/api/customers'

export const useCustomerDetailApi = (userId: Ref<number>) => {
  const { data: customerDetail, isLoading } = useQuery({
    queryKey: ['customerDetail', userId],
    queryFn: () => getCustomerDetail(userId.value),
    enabled: computed(() => !!userId.value),
  })

  return {
    customerDetail,
    isLoading,
  }
}
