import { useMutation } from '@tanstack/vue-query'

import { resetPassword } from '@/api/login'

export const useResetPasswordApi = () => {
  const { mutateAsync: resetPasswordMutation, isPending } = useMutation({
    mutationFn: resetPassword,
  })

  return {
    resetPasswordMutation,
    isPending,
  }
}
