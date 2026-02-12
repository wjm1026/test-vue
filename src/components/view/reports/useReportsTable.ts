import { useRouter } from 'vue-router'

import { routeNames } from '@/router/routes'

export const useReportsTable = () => {
  const router = useRouter()

  const reportDetailHandle = (projectId: number) => {
    router.push({
      name: routeNames.reports.detail,
      params: {
        id: String(projectId),
      },
    })
  }

  const reportDailyHandle = (projectId: number) => {
    router.push({
      name: routeNames.reports.detail,
      params: {
        id: String(projectId),
      },
      query: {
        type: 'daily',
      },
    })
  }

  return {
    reportDetailHandle,
    reportDailyHandle,
  }
}
