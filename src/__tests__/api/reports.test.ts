import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { SortOrder, pageSize } from '@/enum'

const listRequestSpy = vi.fn()
const detailRequestSpy = vi.fn()
const aiAnalysisRequestSpy = vi.fn()
const dailyRequestSpy = vi.fn()
const csvRequestSpy = vi.fn()

const createApiRequestMock: Mock = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('Unexpected call order')
  }),
)

const toCamelCaseKeysMock = vi.hoisted(() => vi.fn((value) => ({ __converted: value })))

const createListMockHandlerMock = vi.hoisted(() => vi.fn(() => Symbol('list-handler')))

vi.mock('@/api/request', () => ({
  createApiRequest: createApiRequestMock,
}))

vi.mock('@/util/camel-case', () => ({
  toCamelCaseKeys: toCamelCaseKeysMock,
}))

vi.mock('@/mocks/processors/mocksHandler', () => ({
  createListMockHandler: createListMockHandlerMock,
}))

describe('api/reports', () => {
  beforeEach(() => {
    vi.resetModules()
    listRequestSpy.mockReset().mockResolvedValue('list-response')
    detailRequestSpy.mockReset().mockResolvedValue('detail-response')
    aiAnalysisRequestSpy.mockReset().mockResolvedValue('ai-analysis-response')
    dailyRequestSpy.mockReset().mockResolvedValue('daily-response')
    csvRequestSpy.mockReset().mockResolvedValue('csv-response')
    createApiRequestMock.mockReset()
    createListMockHandlerMock.mockClear()
    toCamelCaseKeysMock.mockClear()

    createApiRequestMock
      .mockImplementationOnce(() => listRequestSpy)
      .mockImplementationOnce(() => detailRequestSpy)
      .mockImplementationOnce(() => aiAnalysisRequestSpy)
      .mockImplementationOnce(() => dailyRequestSpy)
      .mockImplementationOnce(() => csvRequestSpy)
  })

  it('initializes report API requests with camelized fixtures and list handler', async () => {
    const module = await import('@/api/reports')

    const reportListJson = (await import('@/mocks/data/report/reportList.json')).default
    const reportDetailJson = (await import('@/mocks/data/report/reportDetail.json')).default
    const reportAIAnalysisJson = (await import('@/mocks/data/report/reportAIAnalysis.json')).default
    const reportDailyJson = (await import('@/mocks/data/report/reportDaily.json')).default

    expect(toCamelCaseKeysMock).toHaveBeenCalledTimes(4)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(reportListJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(reportDetailJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(reportAIAnalysisJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(reportDailyJson)

    // Verify createListMockHandler is called with correct parameters for report list:
    // - Multi-field search: ['projectName', 'productName']
    // - Total key: 'total'
    // - List key: 'reports'
    // - Date range filtering options: { startDateField: 'startDate', endDateField: 'endDate' }
    expect(createListMockHandlerMock).toHaveBeenCalledWith(
      ['projectName', 'productName'],
      'total',
      'reports',
      {
        startDateField: 'startDate',
        endDateField: 'endDate',
      },
    )
    const listHandler = createListMockHandlerMock.mock.results[0]?.value

    const [listDataArg, listHandlerArg] = createApiRequestMock.mock.calls[0] ?? []
    expect(listDataArg).toEqual({ __converted: reportListJson })
    expect(listHandlerArg).toBe(listHandler)

    expect(createApiRequestMock).toHaveBeenNthCalledWith(2, { __converted: reportDetailJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(3, { __converted: reportAIAnalysisJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(4, { __converted: reportDailyJson })

    expect(module.getReportList).toBeTypeOf('function')
    expect(module.getReportDetail).toBeTypeOf('function')
    expect(module.getReportAIAnalysis).toBeTypeOf('function')
    expect(module.getReportDaily).toBeTypeOf('function')
    expect(module.downloadReportCSV).toBeTypeOf('function')
  })

  it('delegates report requests to their configured request factories', async () => {
    const {
      getReportList,
      getReportDetail,
      getReportAIAnalysis,
      getReportDaily,
      downloadReportCSV,
    } = await import('@/api/reports')

    const listParams = {
      query: 'alpha',
      offset: 20,
      sortKey: 'projectName',
      sortOrder: SortOrder.Desc,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    } as const

    const listResult = await getReportList(listParams)
    expect(listResult).toBe('list-response')
    expect(listRequestSpy).toHaveBeenCalledWith({
      url: '/report-list',
      method: 'GET',
      params: {
        limit: pageSize,
        ...listParams,
      },
    })

    const detailResult = await getReportDetail()
    expect(detailResult).toBe('detail-response')
    expect(detailRequestSpy).toHaveBeenCalledWith({
      url: '/report-detail',
      method: 'GET',
    })

    const aiAnalysisResult = await getReportAIAnalysis({ projectId: 42 })
    expect(aiAnalysisResult).toBe('ai-analysis-response')
    expect(aiAnalysisRequestSpy).toHaveBeenCalledWith({
      url: '/report-analysis',
      method: 'GET',
      params: {
        projectId: 42,
      },
    })

    const dailyResult = await getReportDaily({ projectId: 42 })
    expect(dailyResult).toBe('daily-response')
    expect(dailyRequestSpy).toHaveBeenCalledWith({
      url: '/report-daily',
      method: 'GET',
      params: {
        projectId: 42,
      },
    })

    const csvResult = await downloadReportCSV(12345)
    expect(csvResult).toBe('csv-response')
    expect(csvRequestSpy).toHaveBeenCalledWith({
      url: '/report-csv',
      method: 'GET',
      params: { project_id: 12345 },
      responseType: 'blob',
    })
  })
})
