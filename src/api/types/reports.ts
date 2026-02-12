export interface Report {
  reportId: string
  projectId: number
  imageUrl: string
  projectName: string
  productName: string
  startDate: string
  endDate: string
  reviewCount: number
  commentCount: number
  goodRatio: number
}

export type ReportsResponse = {
  total: number
  reports: Report[]
}

export interface Item {
  label: string
  value: string | number
}

export interface Satisfaction {
  label?: string
  good: number
  bad: number
}

export interface SexContent {
  reviewerCount: Array<{
    label: string
    value: number
  }>
  satisfaction: Satisfaction[]
}

export interface GenderGeneration {
  male: SexContent
  female: SexContent
  other: SexContent
}

export interface Quantitative {
  satisfaction: Satisfaction[]
  totalCount: Satisfaction
  insightsContent: string
  sexCount: Array<{
    label: string
    value: number
  }>
  sexSatisfaction: Satisfaction[]
  generationCount: Array<{
    label: string
    value: number
  }>
  generationSatisfaction: Satisfaction[]
  genderGeneration: GenderGeneration
}

export interface Comments {
  title: string
  description: string
  commentIds: string
}

export interface Review {
  rank?: number
  label: string
  content: string
  likes: number
}

export interface Qualitative {
  commentContent: string
  reviews: Review[]
  commonWords: string[]
}

export interface ProductComments {
  label: string
  maleComments: Comments[]
  femaleComments: Comments[]
}

export interface ReportDetail {
  title: string
  overview: Item[]
  intelligence: Item[]
  quantitative: Quantitative
  qualitative: Qualitative
  product: ProductComments[]
  improvement: Array<{
    title: string
    methods: Item[]
  }>
}

export type ReportDetailResponse = ReportDetail

export interface AggregationDataItem {
  aggregationName: string
  reviewCount: number
  goodRatio: number
  badRatio: number
}

export interface OverallAggregationDataItem extends AggregationDataItem {
  goodReviewCount: number
  badReviewCount: number
}

type GenderKeys = 'male' | 'female' | 'other'
type AgeKeys = 'Teens' | '20s' | '30s' | '40s' | '50s' | '60s' | '70s' | '80sPlus'

type GenderFields = Record<GenderKeys, AggregationDataItem>
type AgeFields = Record<`age${AgeKeys}`, AggregationDataItem>
type GenderAgeFields = Record<`${GenderKeys}${AgeKeys}`, AggregationDataItem>

export interface AggregationData extends GenderFields, AgeFields, GenderAgeFields {
  overall: OverallAggregationDataItem
}

export interface ReportDailyData {
  productName: string
  maker: string
  description: string
  projectId: number
  projectName: string
  startDate: string
  endDate: string
  method: string
  reviewTargetStart: string
  reviewTargetEnd: string
  imageUrl: string
  updatedDate: string
  aggregationData: AggregationData
}

export type ReportDailyResponse = ReportDailyData
export interface CSVDownloadResponse {
  blob: Blob
  headers: Record<string, string | string[] | number>
}
