import { useMutation } from '@tanstack/vue-query'

import { deleteAccount } from '@/api/accounts'

export const useAccountDeleteApi = () => {
  const { mutateAsync: deleteAccountMutateAsync, isPending: isDeleteLoading } = useMutation({
    mutationFn: deleteAccount,
  })

  return {
    deleteAccountMutateAsync,
    isDeleteLoading,
  }
}
