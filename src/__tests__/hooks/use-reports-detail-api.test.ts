// generated-by: ai-assist v1.0
// type: unit
// description: useReportsDetailApi tests verifying vue-query setup and enabled toggle.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const useQueryMock = vi.hoisted(() => vi.fn())
const getReportAIAnalysisMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/reports', () => ({
  getReportAIAnalysis: getReportAIAnalysisMock,
}))

describe('useReportsDetailApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getReportAIAnalysisMock.mockReset()
  })

  it('connects vue-query with projectId ref and forwards to getReportAIAnalysis', async () => {
    const detailRef = ref()
    const loadingRef = ref(false)
    const refetchMock = vi.fn()
    useQueryMock.mockReturnValue({
      data: detailRef,
      isLoading: loadingRef,
      refetch: refetchMock,
    })
    getReportAIAnalysisMock.mockResolvedValue({ data: {} })

    const module = await import('@/hooks/useReportsDetailApi')
    const projectId = ref<number | undefined>(101)
    const result = module.useReportsDetailApi(projectId)

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const options = useQueryMock.mock.calls[0]?.[0]
    expect(options?.queryKey).toEqual(['reportDetail', projectId])
    expect(options?.placeholderData?.('prev')).toBe('prev')

    await options?.queryFn?.()
    expect(getReportAIAnalysisMock).toHaveBeenCalledWith({ projectId: 101 })
    expect(options?.enabled?.value).toBe(true)

    projectId.value = undefined
    expect(options?.enabled?.value).toBe(false)

    expect(result.reportDetail).toBe(detailRef)
    expect(result.isLoading).toBe(loadingRef)
    expect(result.refetchDetail).toBe(refetchMock)
  })
})
