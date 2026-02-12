export type ReportAIAnalysis = ReportAIAnalysisData

export interface ReportAIAnalysisData {
  projectInfo: ProjectInfo
  quantitativeEvaluation: QuantitativeEvaluation
  qualitativeEvaluation: QualitativeEvaluation
  productStrengthImprovement: ProductStrengthImprovement
  improvementMeasures: ImprovementMeasures
}

export interface ImprovementMeasures {
  improvementPoints: Improvement[]
  improvementStrategies: Improvement[]
}

export interface Improvement {
  title: string
  detail: string
  displayOrder: number
}

export interface ProductStrengthImprovement {
  strengths: Improvements
  improvements: Improvements
}

export interface Improvements {
  youngMale: Male
  middleMale: Male
  matureMale: Male
  seniorMale: Male
  elderlyMale: Male
  youngFemale: Male
  middleFemale: Male
  matureFemale: Male
  seniorFemale: Male
  elderlyFemale: Male
}

export interface Male {
  aggregationName: string
  contents: Content[]
}

export interface Content {
  productInsight: string
  detail: string
  displayOrder: number
  commentId: number[]
}

export interface ProjectInfo {
  projectId: number
  projectName: string
  startDate: Date
  endDate: Date
  method: string
  reviewTargetStart: Date
  reviewTargetEnd: Date
  productName: string
  maker: string
  description: string
  imageUrl: string
  updatedDate: Date
  reviewCount: number
}

export interface QualitativeEvaluation {
  commentInsight: string
  good: Bad
  bad: Bad
}

export interface Bad {
  topComments: TopComment[]
  frequentWords: FrequentWord[]
  wordCloudImageUrl: string
  networkImageUrl: string
}

export interface FrequentWord {
  word: string
  rank: number
}

export interface TopComment {
  rank: number
  userIconIndex: number
  nickname: string
  ageGroup: string
  gender: string
  comment: string
  likeCount: number
}

export interface QuantitativeEvaluation {
  aggregationData: AggregationData
  insight: string
}

type GenderKeys = 'male' | 'female' | 'other'
type AgeKeys = 'Teens' | '20s' | '30s' | '40s' | '50s' | '60s' | '70s' | '80sPlus'

type GenderFields = Record<GenderKeys, AgeGroupStats>
type AgeFields = Record<`age${AgeKeys}`, AgeGroupStats>
type GenderAgeFields = Record<`${GenderKeys}${AgeKeys}`, AgeGroupStats>

export interface AggregationData extends GenderFields, AgeFields, GenderAgeFields {
  overall: Overall
}

export interface AgeGroupStats {
  aggregationName: string
  reviewCount: number
  goodRatio: number
  badRatio: number
}

export interface Overall {
  aggregationName: string
  reviewCount: number
  goodRatio: number
  badRatio: number
  goodReviewCount: number
  badReviewCount: number
}
