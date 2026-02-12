import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getReportAIAnalysis } from '@/api/reports'

export const useReportsDetailApi = (projectId: Ref<number | undefined>) => {
  const {
    data: reportDetail,
    isLoading,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: ['reportDetail', projectId],
    queryFn: () => getReportAIAnalysis({ projectId: projectId.value! }),
    placeholderData: (prev) => prev,
    enabled: computed(() => !!projectId.value),
  })

  return {
    reportDetail,
    isLoading,
    refetchDetail,
  }
}
