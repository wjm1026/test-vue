import { useMutation } from '@tanstack/vue-query'

import { login } from '@/api/login'

export const useLoginApi = () => {
  const { mutateAsync: loginMutation, isPending } = useMutation({
    mutationFn: login,
  })

  return {
    loginMutation,
    isPending,
  }
}
