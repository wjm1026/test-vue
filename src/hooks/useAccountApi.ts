import { useMutation } from '@tanstack/vue-query'

import { addAccount } from '@/api/accounts'

export const useAccountApi = () => {
  const { mutateAsync: submitAccount, isPending } = useMutation({
    mutationFn: addAccount,
  })

  return {
    submitAccount,
    isPending,
  }
}
