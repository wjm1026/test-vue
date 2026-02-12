import { useMutation } from '@tanstack/vue-query'

import { updateStatus } from '@/api/accounts'

export const useAccountStatusApi = () => {
  const { mutateAsync: updateAccountStatus, isPending: isStatusLoading } = useMutation({
    mutationFn: updateStatus,
  })

  return {
    updateAccountStatus,
    isStatusLoading,
  }
}
