// generated-by: ai-assist v1.0
// type: unit
// description: useReportsDetailPage tests covering default report detail flow and daily-mode transformations.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import type { ReportDailyData } from '@/api/types/reports'

const useRouteMock = vi.hoisted(() =>
  vi.fn(() => ({
    params: { id: '101' },
    query: {},
  })),
)

const useReportsDetailApiMock = vi.hoisted(() =>
  vi.fn(() => ({
    reportDetail: ref({
      projectInfo: {
        projectId: 101,
        projectName: 'レポート101',
      },
      quantitativeEvaluation: {
        aggregationData: { overall: { reviewCount: 50 } },
        insight: '詳細インサイト',
      },
      qualitativeEvaluation: { commentInsight: 'コメント' },
      productStrengthImprovement: { strengths: {} },
      improvementMeasures: [{ title: '改善', detail: '詳細', displayOrder: 1 }],
    }),
    isLoading: ref(false),
  })),
)

const useReportDailyApiMock = vi.hoisted(() =>
  vi.fn(() => ({
    reportDaily: ref(),
    isLoading: ref(false),
  })),
)

vi.mock('vue-router', () => ({
  useRoute: useRouteMock,
}))

vi.mock('@/hooks/useReportsDetailApi', () => ({
  useReportsDetailApi: useReportsDetailApiMock,
}))

vi.mock('@/hooks/useReportDailyApi', () => ({
  useReportDailyApi: useReportDailyApiMock,
}))

describe('useReportsDetailPage', () => {
  beforeEach(() => {
    vi.resetModules()
    useRouteMock.mockReset()
    useReportsDetailApiMock.mockClear()
    useReportDailyApiMock.mockClear()
  })

  const loadComposable = async () => {
    const module = await import('@/views/reports/detail/useReportsDetailPage')
    return module.useReportsDetailPage()
  }

  it('exposes detail data and calls detail API with numeric project id', async () => {
    // Purpose: ensure default flow uses report detail API and exposes all computed refs.
    useRouteMock.mockReturnValue({
      params: { id: '101' },
      query: {},
    })

    const composable = await loadComposable()

    expect(useReportsDetailApiMock).toHaveBeenCalledTimes(1)
    const callArgs = useReportsDetailApiMock.mock.calls[0]
    expect(callArgs).toBeDefined()
    expect(callArgs?.length).toBeGreaterThanOrEqual(1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projectIdRef = (callArgs as any)?.[0] as unknown as { value: number }
    expect(projectIdRef.value).toBe(101)

    expect(composable.isDailyType.value).toBe(false)
    expect(composable.projectInfo.value?.projectName).toBe('レポート101')
    expect(composable.quantitativeEvaluation.value?.insight).toBe('詳細インサイト')
    expect(composable.qualitativeEvaluation.value).toEqual({ commentInsight: 'コメント' })
    expect(composable.productStrengthImprovement.value).toEqual({ strengths: {} })
    expect(composable.improvementMeasures.value).toEqual([
      { title: '改善', detail: '詳細', displayOrder: 1 },
    ])
    expect(composable.isLoading.value).toBe(false)
  })

  it('switches to daily data when query.type is daily and maps project info/quantitative', async () => {
    // Purpose: verify daily mode pulls data from reportDaily with transformed project info.
    const sampleDaily: ReportDailyData = {
      projectId: 202,
      projectName: '日次レポート',
      productName: '商品A',
      maker: 'メーカーA',
      description: '説明',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-07T00:00:00Z',
      method: 'method',
      reviewTargetStart: '2024-01-01T00:00:00Z',
      reviewTargetEnd: '2024-01-07T00:00:00Z',
      imageUrl: 'image.png',
      updatedDate: '2024-01-08T00:00:00Z',
      aggregationData: {
        overall: {
          aggregationName: '全体',
          reviewCount: 30,
          goodRatio: 60,
          badRatio: 40,
          goodReviewCount: 18,
          badReviewCount: 12,
        },
      } as ReportDailyData['aggregationData'],
    }

    useRouteMock.mockReturnValue({
      params: { id: '202' },
      query: { type: 'daily' },
    })

    useReportDailyApiMock.mockReturnValue({
      reportDaily: ref(sampleDaily),
      isLoading: ref(true),
    })

    const composable = await loadComposable()

    expect(useReportDailyApiMock).toHaveBeenCalledTimes(1)
    const callArgs = useReportDailyApiMock.mock.calls[0]
    expect(callArgs).toBeDefined()
    expect(callArgs?.length).toBeGreaterThanOrEqual(1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dailyProjectIdComputed = (callArgs as any)?.[0] as unknown as { value: number }
    expect(dailyProjectIdComputed.value).toBe(202)

    expect(composable.isDailyType.value).toBe(true)
    expect(composable.isLoading.value).toBe(true)
    expect(composable.projectInfo.value?.projectId).toBe(202)
    expect(composable.projectInfo.value?.reviewCount).toBe(30)
    expect(composable.quantitativeEvaluation.value).toEqual({
      aggregationData: sampleDaily.aggregationData,
      insight: '',
    })
    expect(composable.qualitativeEvaluation.value).toBeUndefined()
    expect(composable.productStrengthImprovement.value).toBeUndefined()
    expect(composable.improvementMeasures.value).toBeUndefined()
  })
})
