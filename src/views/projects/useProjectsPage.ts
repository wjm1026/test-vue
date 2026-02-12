import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

import { routeNames } from '@/router/routes'
import { defaultPage, pageSize, SortOrder } from '@/enum'
import { useProjectListApi } from '@/hooks/useProjectListApi'
import { useDebouncedRef } from '@/hooks/useDebouncedRef'

export const useProjectsPage = () => {
  const router = useRouter()
  const page = ref(defaultPage)
  const searchKeyword = ref('')
  const debouncedQuery = useDebouncedRef(searchKeyword)
  const sortField = ref('')
  const sortOrder = ref<SortOrder>(SortOrder.Desc)

  const offset = computed(() => (page.value - 1) * pageSize)

  const { projectList, isLoading } = useProjectListApi(
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

  const projectAdd = () => {
    router.push({
      name: routeNames.projects.create,
    })
  }

  return {
    projectList,
    isLoading,
    page,
    searchKeyword,
    sortField,
    sortOrder,
    pageChange,
    projectAdd,
  }
}
