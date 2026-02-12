import { createApiRequest } from './request'
import type {
  ReportsResponse,
  Report,
  ReportDetailResponse,
  ReportDailyResponse,
  CSVDownloadResponse,
} from './types/reports'
import type { ReportAIAnalysis } from './types/reportAIAnalysis'

import type { SortOrder } from '@/enum'
import reportList from '@/mocks/data/report/reportList.json'
import reportDetail from '@/mocks/data/report/reportDetail.json'
import reportDaily from '@/mocks/data/report/reportDaily.json'
import { toCamelCaseKeys } from '@/util/camel-case'
import { createListMockHandler } from '@/mocks/processors/mocksHandler'
import { pageSize } from '@/enum'
import reportAIAnalysis from '@/mocks/data/report/reportAIAnalysis.json'

const requestReportList = createApiRequest<ReportsResponse>(
  toCamelCaseKeys(reportList),
  createListMockHandler<Report, ReportsResponse, 'total', 'reports'>(
    ['projectName', 'productName'],
    'total',
    'reports',
    {
      startDateField: 'startDate',
      endDateField: 'endDate',
    },
  ),
)

const requestReportDetail = createApiRequest<ReportDetailResponse>(toCamelCaseKeys(reportDetail))

const requestReportAIAnalysis = createApiRequest<ReportAIAnalysis>(
  toCamelCaseKeys(reportAIAnalysis),
)

const requestReportDaily = createApiRequest<ReportDailyResponse>(toCamelCaseKeys(reportDaily))

const requestReportCSV = createApiRequest<CSVDownloadResponse>({
  blob: new Blob(
    [
      'card_number,project_id,project_name,rating,comment,point\n123456,1001,プロジェクトA,5,とても良い,10',
    ],
    { type: 'text/csv' },
  ),
  headers: {
    'content-disposition': 'attachment; filename="report.csv"',
  },
})

const mapSortKeyToApiFormat = (sortKey?: string): string | undefined => {
  if (!sortKey) return undefined
  if (sortKey === 'startDate') return 'period'
  return sortKey
}

export const getReportList = (params?: {
  query: string
  offset: number
  limit?: number
  sortKey: string
  sortOrder: SortOrder
  startDate?: string
  endDate?: string
}) =>
  requestReportList({
    url: '/report-list',
    method: 'GET',
    params: {
      limit: pageSize,
      ...params,
      sortKey: mapSortKeyToApiFormat(params?.sortKey),
    },
  })

export const getReportDetail = () =>
  requestReportDetail({
    url: '/report-detail',
    method: 'GET',
  })

export const getReportAIAnalysis = (params: { projectId: number }) =>
  requestReportAIAnalysis({
    url: '/report-analysis',
    method: 'GET',
    params: {
      projectId: params.projectId,
    },
  })

export const getReportDaily = (params: { projectId: number }) =>
  requestReportDaily({
    url: '/report-daily',
    method: 'GET',
    params: {
      projectId: params.projectId,
    },
  })

export const downloadReportCSV = (projectId: number) =>
  requestReportCSV({
    url: '/report-csv',
    method: 'GET',
    params: { project_id: projectId },
    responseType: 'blob',
  })
