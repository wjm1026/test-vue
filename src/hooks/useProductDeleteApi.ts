import { useMutation } from '@tanstack/vue-query'

import { deleteProduct } from '@/api/products'

export const useProductDeleteApi = () => {
  const { mutateAsync: deleteProductMutateAsync, isPending: isDeleteLoading } = useMutation({
    mutationFn: deleteProduct,
  })
  return {
    deleteProductMutateAsync,
    isDeleteLoading,
  }
}
