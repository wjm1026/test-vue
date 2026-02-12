import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'

import { getAccountDetail } from '@/api/accounts'

export const useAccountDetailApi = (accountId: Ref<number>) => {
  const { data: accountDetail, isLoading } = useQuery({
    queryKey: ['accountDetail', accountId],
    queryFn: () => getAccountDetail(accountId.value),
    enabled: () => !!accountId.value,
    placeholderData: (prev) => prev,
  })

  return {
    accountDetail,
    isLoading,
  }
}
