import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAccountListApi } from '@/hooks/useAccountListApi'
import { defaultPage, pageSize, SortOrder } from '@/enum'
import { routeNames } from '@/router/routes'
import { useDebouncedRef } from '@/hooks/useDebouncedRef'

export const useAccountsPage = () => {
  const router = useRouter()
  const page = ref(defaultPage)
  const searchKeyword = ref('')
  const debouncedQuery = useDebouncedRef(searchKeyword)
  const sortField = ref('')
  const sortOrder = ref<SortOrder>(SortOrder.Asc)
  const offset = computed(() => (page.value - 1) * pageSize)
  const { accountList, isLoading } = useAccountListApi(
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

  const accountAdd = () => {
    router.push({ name: routeNames.accounts.create })
  }

  return {
    accountList,
    page,
    searchKeyword,
    sortField,
    sortOrder,
    isLoading,
    pageChange,
    accountAdd,
  }
}
