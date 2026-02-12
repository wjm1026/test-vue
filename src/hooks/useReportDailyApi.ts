import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import { getReportDaily } from '@/api/reports'

export const useReportDailyApi = (projectId: Ref<number | undefined>) => {
  const {
    data: reportDaily,
    isLoading,
    refetch: refetchReportDaily,
  } = useQuery({
    queryKey: ['reportDaily', projectId],
    queryFn: () => getReportDaily({ projectId: projectId.value! }),
    placeholderData: (prev) => prev,
    enabled: computed(() => !!projectId.value),
  })

  return {
    reportDaily,
    isLoading,
    refetchReportDaily,
  }
}
