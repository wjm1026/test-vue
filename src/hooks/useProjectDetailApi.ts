import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getProjectDetail } from '@/api/index'

export const useProjectDetailApi = (projectId: Ref<number | undefined>) => {
  const {
    data: projectDetail,
    isLoading,
    refetch: refetchProjectDetail,
  } = useQuery({
    queryKey: ['projectDetail', projectId],
    queryFn: () =>
      getProjectDetail({
        projectId: projectId.value!,
      }),
    enabled: computed(() => !!projectId.value),
    placeholderData: (prev) => prev,
  })

  return {
    projectDetail,
    isLoading,
    refetchProjectDetail,
  }
}
