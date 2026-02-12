import { computed, ref } from 'vue'

import { useCustomerListApi } from '@/hooks/useCustomerListApi'
import { defaultPage, pageSize, SortOrder } from '@/enum'
import { useDebouncedRef } from '@/hooks/useDebouncedRef'

export const useCustomersPage = () => {
  const page = ref(defaultPage)
  const searchKeyword = ref('')
  const debouncedQuery = useDebouncedRef(searchKeyword)
  const sortField = ref('')
  const sortOrder = ref<SortOrder>(SortOrder.Asc)
  const activeTab = ref('all')
  const offset = computed(() => (page.value - 1) * pageSize)
  const status = computed(() => (activeTab.value === 'all' ? undefined : 'suspended'))
  const { customerList, isLoading } = useCustomerListApi(
    {
      offset,
      query: debouncedQuery,
      sortKey: sortField,
      sortOrder: sortOrder,
      status,
    },
    page,
  )
  const pageChange = (newPage: number) => {
    page.value = newPage
  }

  return {
    customerList,
    page,
    searchKeyword,
    sortField,
    sortOrder,
    activeTab,
    isLoading,
    pageChange,
  }
}
