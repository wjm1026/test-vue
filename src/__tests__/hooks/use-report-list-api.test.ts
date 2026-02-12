// generated-by: ai-assist v1.0
// type: unit
// description: useReportListApi tests verifying query wiring and watch-driven page reset.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import type { SortOrder } from '@/enum'

const useQueryMock = vi.hoisted(() => vi.fn())
const getReportListMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/reports', () => ({
  getReportList: getReportListMock,
}))

describe('useReportListApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getReportListMock.mockReset()
  })

  const loadComposable = async () => {
    const module = await import('@/hooks/useReportListApi')
    return module.useReportListApi
  }

  it('configures query with reactive params and forwards values to API', async () => {
    const params = {
      offset: ref(0),
      query: ref('initial'),
      sortKey: ref('projectName'),
      sortOrder: ref<SortOrder>('asc' as SortOrder),
      startDate: ref(''),
      endDate: ref(''),
    }
    const page = ref(2)
    const queryResult = { data: ref(), isFetching: ref(false) }
    useQueryMock.mockReturnValue(queryResult)
    getReportListMock.mockResolvedValue({ data: {} })

    const useReportListApi = await loadComposable()
    const result = useReportListApi(params, page)

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const options = useQueryMock.mock.calls[0]?.[0]
    expect(options?.queryKey).toEqual([
      'reportList',
      params.offset,
      params.query,
      params.sortKey,
      params.sortOrder,
      params.startDate,
      params.endDate,
    ])
    expect(options?.placeholderData?.('prev')).toBe('prev')

    await options?.queryFn?.()
    expect(getReportListMock).toHaveBeenCalledWith({
      offset: 0,
      query: 'initial',
      sortKey: 'projectName',
      sortOrder: 'asc',
      startDate: undefined,
      endDate: undefined,
    })

    expect(result.reportList).toBe(queryResult.data)
    expect(result.isLoading).toBe(queryResult.isFetching)
  })

  it('resets page when query or sort inputs change', async () => {
    const params = {
      offset: ref(10),
      query: ref('foo'),
      sortKey: ref('projectName'),
      sortOrder: ref<SortOrder>('asc' as SortOrder),
      startDate: ref(''),
      endDate: ref(''),
    }
    const page = ref(5)
    useQueryMock.mockReturnValue({ data: ref(), isLoading: ref(false) })

    const useReportListApi = await loadComposable()
    useReportListApi(params, page)

    params.query.value = 'bar'
    params.sortKey.value = 'productName'
    params.sortOrder.value = 'desc' as SortOrder
    await Promise.resolve()

    expect(page.value).toBe(1)
  })
})
