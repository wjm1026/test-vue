import { useMutation } from '@tanstack/vue-query'

import { forgetPassword } from '@/api/login'

export const useForgetPasswordApi = () => {
  const { mutateAsync: forgetPasswordMutation, isPending } = useMutation({
    mutationFn: forgetPassword,
  })

  return {
    forgetPasswordMutation,
    isPending,
  }
}
