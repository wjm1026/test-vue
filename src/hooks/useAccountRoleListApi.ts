import { useQuery } from '@tanstack/vue-query'

import { getAccountRoleList } from '@/api/accounts'

export const useAccountRoleListApi = () => {
  const { data: accountRoleList, isFetching: isLoading } = useQuery({
    queryKey: ['accountRoleList'],
    queryFn: getAccountRoleList,
    placeholderData: (prev) => prev,
  })
  return {
    accountRoleList,
    isLoading,
  }
}
