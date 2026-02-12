// generated-by: ai-assist v1.0
// type: unit
// description: useReportDailyApi test ensuring vue-query wiring and enabled behavior.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const useQueryMock = vi.hoisted(() => vi.fn())
const getReportDailyMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/reports', () => ({
  getReportDaily: getReportDailyMock,
}))

describe('useReportDailyApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getReportDailyMock.mockReset()
  })

  it('registers a query that fetches report daily data when projectId exists', async () => {
    const reportDailyRef = ref()
    const loadingRef = ref(false)
    const refetchMock = vi.fn()
    useQueryMock.mockReturnValue({
      data: reportDailyRef,
      isLoading: loadingRef,
      refetch: refetchMock,
    })
    getReportDailyMock.mockResolvedValue({ data: {} })

    const module = await import('@/hooks/useReportDailyApi')
    const projectId = ref<number | undefined>(123)
    const result = module.useReportDailyApi(projectId)

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const options = useQueryMock.mock.calls[0]?.[0]
    expect(options?.queryKey).toEqual(['reportDaily', projectId])
    expect(typeof options?.queryFn).toBe('function')
    expect(options?.placeholderData?.('previous')).toBe('previous')

    await options?.queryFn?.()
    expect(getReportDailyMock).toHaveBeenCalledWith({ projectId: 123 })

    expect(options?.enabled?.value).toBe(true)

    projectId.value = undefined
    expect(options?.enabled?.value).toBe(false)

    expect(result.reportDaily).toBe(reportDailyRef)
    expect(result.isLoading).toBe(loadingRef)
    expect(result.refetchReportDaily).toBe(refetchMock)
  })
})
