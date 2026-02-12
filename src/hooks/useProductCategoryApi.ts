import { useQuery } from '@tanstack/vue-query'

import { getProductCategory } from '@/api/products'

export const useProductCategoryApi = () => {
  const { data: productCategory, isFetching } = useQuery({
    queryKey: ['category'],
    queryFn: getProductCategory,
    placeholderData: (prev) => prev,
  })
  return {
    productCategory,
    isFetching,
  }
}
