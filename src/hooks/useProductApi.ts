import { useMutation } from '@tanstack/vue-query'

import { addProduct } from '@/api/products'

export const useProductApi = () => {
  const { mutateAsync: submitProduct, isPending } = useMutation({
    mutationFn: addProduct,
  })

  return {
    submitProduct,
    isPending,
  }
}
