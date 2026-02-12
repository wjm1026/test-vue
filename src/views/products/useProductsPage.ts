import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

import { useProductListApi } from '@/hooks/useProductListApi'
import { defaultPage, pageSize, SortOrder } from '@/enum'
import { routeNames } from '@/router/routes'
import { useDebouncedRef } from '@/hooks/useDebouncedRef'

export const useProductsPage = () => {
  const router = useRouter()
  const page = ref(defaultPage)
  const searchKeyword = ref('')
  const debouncedQuery = useDebouncedRef(searchKeyword)
  const sortField = ref('')
  const sortOrder = ref<SortOrder>(SortOrder.Asc)
  const offset = computed(() => (page.value - 1) * pageSize)
  const { productList, isLoading } = useProductListApi(
    {
      offset,
      query: debouncedQuery,
      sortKey: sortField,
      sortOrder: sortOrder,
    },
    page,
  )
  const pageChange = (newPage: number) => {
    page.value = newPage
  }

  const productAdd = () => {
    router.push({
      name: routeNames.products.registration,
    })
  }
  return {
    productList,
    page,
    searchKeyword,
    sortField,
    sortOrder,
    isLoading,
    pageChange,
    productAdd,
  }
}
