import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import type { ProjectInfo } from '@/api/types/reportAIAnalysis'
import type { ReportDailyData } from '@/api/types/reports'
import { useReportsDetailApi } from '@/hooks/useReportsDetailApi'
import { useReportDailyApi } from '@/hooks/useReportDailyApi'
import type { CommentRating } from '@/enum'

const transformDailyDataToProjectInfo = (data: ReportDailyData): ProjectInfo => ({
  projectId: data.projectId,
  projectName: data.projectName,
  productName: data.productName,
  maker: data.maker,
  description: data.description,
  startDate: new Date(data.startDate),
  endDate: new Date(data.endDate),
  method: data.method,
  reviewTargetStart: new Date(data.reviewTargetStart),
  reviewTargetEnd: new Date(data.reviewTargetEnd),
  imageUrl: data.imageUrl,
  updatedDate: new Date(data.updatedDate),
  reviewCount: data.aggregationData?.overall?.reviewCount ?? 0,
})

export const useReportsDetailPage = () => {
  const isCommentsOpen = ref(false)
  const route = useRoute()
  const rating = ref<CommentRating | undefined>(undefined)
  const reportId = computed(() => route.params.id as string)
  const isDailyType = computed(() => route.query.type === 'daily')
  const projectId = computed(() => Number(reportId.value))

  const { reportDetail, isLoading: isLoadingDetail } = useReportsDetailApi(
    computed(() => (isDailyType.value ? undefined : projectId.value)),
  )
  const { reportDaily, isLoading: isLoadingDaily } = useReportDailyApi(
    computed(() => (isDailyType.value ? projectId.value : undefined)),
  )

  const isLoading = computed(() =>
    isDailyType.value ? isLoadingDaily.value : isLoadingDetail.value,
  )

  const projectInfo = computed(() => {
    if (isDailyType.value && reportDaily.value) {
      return transformDailyDataToProjectInfo(reportDaily.value)
    }
    return reportDetail.value?.projectInfo
  })

  const aggregationData = computed(() => {
    if (isDailyType.value && reportDaily.value) {
      return reportDaily.value.aggregationData
    }
    return reportDetail.value?.quantitativeEvaluation?.aggregationData
  })

  const quantitativeEvaluation = computed(() => {
    if (!aggregationData.value) {
      return reportDetail.value?.quantitativeEvaluation
    }
    return {
      aggregationData: aggregationData.value,
      insight: isDailyType.value ? '' : (reportDetail.value?.quantitativeEvaluation?.insight ?? ''),
    }
  })

  const getDetailOnlyData = <T>(getter: () => T | undefined): T | undefined => {
    return isDailyType.value ? undefined : getter()
  }

  const qualitativeEvaluation = computed(() =>
    getDetailOnlyData(() => reportDetail.value?.qualitativeEvaluation),
  )

  const productStrengthImprovement = computed(() =>
    getDetailOnlyData(() => reportDetail.value?.productStrengthImprovement),
  )

  const improvementMeasures = computed(() =>
    getDetailOnlyData(() => reportDetail.value?.improvementMeasures),
  )

  const isEmpty = computed(() => {
    if (isLoading.value) return false
    if (isDailyType.value) {
      return !reportDaily.value
    }
    return !reportDetail.value
  })

  const handleOpenComments = (r: CommentRating | undefined) => {
    isCommentsOpen.value = true
    rating.value = r
  }

  return {
    rating,
    isDailyType,
    isCommentsOpen,
    reportDetail,
    projectInfo,
    quantitativeEvaluation,
    qualitativeEvaluation,
    productStrengthImprovement,
    improvementMeasures,
    isLoading,
    isEmpty,
    handleOpenComments,
  }
}
