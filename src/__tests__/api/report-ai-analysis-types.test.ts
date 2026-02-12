// generated-by: ai-assist v1.0
// type: unit
// description: Structural tests for src/api/types/reportAIAnalysis.ts.

import { describe, expect, expectTypeOf, it } from 'vitest'

import type {
  AgeGroupStats,
  AggregationData,
  Improvement,
  ImprovementMeasures,
  Improvements,
  Male,
  ProjectInfo,
  QualitativeEvaluation,
  QuantitativeEvaluation,
  ProductStrengthImprovement,
  ReportAIAnalysis,
  ReportAIAnalysisData,
} from '@/api/types/reportAIAnalysis'

const makeStats = (aggregationName: string): AgeGroupStats => ({
  aggregationName,
  reviewCount: 1,
  goodRatio: 0.5,
  badRatio: 0.5,
})

describe('ReportAIAnalysis root', () => {
  it('aliases ReportAIAnalysis to ReportAIAnalysisData', () => {
    expectTypeOf<ReportAIAnalysis>().toEqualTypeOf<ReportAIAnalysisData>()
    expect(true).toBe(true)
  })

  it('requires all nested sections on the root data', () => {
    expectTypeOf<ReportAIAnalysisData>().toMatchTypeOf<{
      projectInfo: ProjectInfo
      quantitativeEvaluation: QuantitativeEvaluation
      qualitativeEvaluation: QualitativeEvaluation
      productStrengthImprovement: ProductStrengthImprovement
      improvementMeasures: ImprovementMeasures
    }>()
    expect(true).toBe(true)
  })
})

describe('Improvement sections', () => {
  it('structures Improvements with gender/age buckets mapped to Male entries', () => {
    expectTypeOf<Improvements>().toMatchTypeOf<{
      youngMale: Male
      middleFemale: Male
      elderlyFemale: Male
    }>()

    const improvements: Improvements = {
      youngMale: { aggregationName: 'Young male', contents: [] },
      middleMale: { aggregationName: 'Middle male', contents: [] },
      matureMale: { aggregationName: 'Mature male', contents: [] },
      seniorMale: { aggregationName: 'Senior male', contents: [] },
      elderlyMale: { aggregationName: 'Elderly male', contents: [] },
      youngFemale: { aggregationName: 'Young female', contents: [] },
      middleFemale: { aggregationName: 'Middle female', contents: [] },
      matureFemale: { aggregationName: 'Mature female', contents: [] },
      seniorFemale: { aggregationName: 'Senior female', contents: [] },
      elderlyFemale: { aggregationName: 'Elderly female', contents: [] },
    }
    expect(improvements.youngMale.aggregationName).toBe('Young male')
  })

  it('defines ImprovementMeasures as two Improvement arrays', () => {
    expectTypeOf<ImprovementMeasures>().toMatchTypeOf<{
      improvementPoints: Improvement[]
      improvementStrategies: Improvement[]
    }>()

    const measure: ImprovementMeasures = {
      improvementPoints: [{ title: 'Strength', detail: 'Great smell', displayOrder: 1 }],
      improvementStrategies: [{ title: 'Action', detail: 'Improve texture', displayOrder: 2 }],
    }
    expect(measure.improvementStrategies[0].title).toBe('Action')
  })
})

describe('AggregationData type', () => {
  it('combines gender, age, and gender-age specific stats with overall summary', () => {
    expectTypeOf<AggregationData>().toMatchTypeOf<{
      male: { reviewCount: number }
      ageTeens: { reviewCount: number }
      maleTeens: { reviewCount: number }
      overall: { goodReviewCount: number }
    }>()

    const stats: AggregationData = {
      male: makeStats('Male'),
      female: makeStats('Female'),
      other: makeStats('Other'),
      ageTeens: makeStats('Age teens'),
      age20s: makeStats('Age 20s'),
      age30s: makeStats('Age 30s'),
      age40s: makeStats('Age 40s'),
      age50s: makeStats('Age 50s'),
      age60s: makeStats('Age 60s'),
      age70s: makeStats('Age 70s'),
      age80sPlus: makeStats('Age 80s+'),
      maleTeens: makeStats('Male teens'),
      femaleTeens: makeStats('Female teens'),
      otherTeens: makeStats('Other teens'),
      male20s: makeStats('Male 20s'),
      female20s: makeStats('Female 20s'),
      other20s: makeStats('Other 20s'),
      male30s: makeStats('Male 30s'),
      female30s: makeStats('Female 30s'),
      other30s: makeStats('Other 30s'),
      male40s: makeStats('Male 40s'),
      female40s: makeStats('Female 40s'),
      other40s: makeStats('Other 40s'),
      male50s: makeStats('Male 50s'),
      female50s: makeStats('Female 50s'),
      other50s: makeStats('Other 50s'),
      male60s: makeStats('Male 60s'),
      female60s: makeStats('Female 60s'),
      other60s: makeStats('Other 60s'),
      male70s: makeStats('Male 70s'),
      female70s: makeStats('Female 70s'),
      other70s: makeStats('Other 70s'),
      male80sPlus: makeStats('Male 80s+'),
      female80sPlus: makeStats('Female 80s+'),
      other80sPlus: makeStats('Other 80s+'),
      overall: {
        aggregationName: 'Overall',
        reviewCount: 36,
        goodRatio: 0.6,
        badRatio: 0.4,
        goodReviewCount: 20,
        badReviewCount: 16,
      },
    }

    expect(stats.overall.goodReviewCount).toBe(20)
    expect(stats.maleTeens.reviewCount).toBe(1)
    expect(stats.female60s.reviewCount).toBe(1)
  })
})
