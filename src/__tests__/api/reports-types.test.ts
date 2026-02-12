// generated-by: ai-assist v1.0
// type: unit
// description: Structural tests for src/api/types/reports.ts.

import { describe, expect, expectTypeOf, it } from 'vitest'

import type {
  AggregationData,
  Quantitative,
  Report,
  ReportDailyData,
  ReportDailyResponse,
  ReportDetail,
  ReportDetailResponse,
  ReportsResponse,
  Satisfaction,
} from '@/api/types/reports'

const makeSatisfaction = (label: string): Satisfaction => ({
  label,
  good: 1,
  bad: 0,
})

describe('Report summary and detail types', () => {
  it('matches Report and ReportsResponse shape', () => {
    expectTypeOf<Report>().toMatchTypeOf<{
      reportId: string
      commentCount: number
      goodRatio: number
    }>()

    const response: ReportsResponse = {
      total: 1,
      reports: [
        {
          reportId: 'r-1',
          projectId: 10,
          imageUrl: 'https://example.com/r.jpg',
          projectName: 'Campaign',
          productName: 'Lotion',
          startDate: '2024-01-01',
          endDate: '2024-02-01',
          reviewCount: 100,
          commentCount: 80,
          goodRatio: 0.6,
        },
      ],
    }
    expect(response.reports[0].projectName).toBe('Campaign')
  })

  it('aliases ReportDetailResponse to ReportDetail and enforces nested structure', () => {
    expectTypeOf<ReportDetailResponse>().toMatchTypeOf<ReportDetail>()

    const quantitative: Quantitative = {
      satisfaction: [makeSatisfaction('overall')],
      totalCount: makeSatisfaction('total'),
      insightsContent: 'insights',
      sexCount: [{ label: 'Male', value: 10 }],
      sexSatisfaction: [makeSatisfaction('male')],
      generationCount: [{ label: '20s', value: 5 }],
      generationSatisfaction: [makeSatisfaction('20s')],
      genderGeneration: {
        male: {
          reviewerCount: [{ label: 'male', value: 10 }],
          satisfaction: [makeSatisfaction('male')],
        },
        female: {
          reviewerCount: [{ label: 'female', value: 12 }],
          satisfaction: [makeSatisfaction('female')],
        },
        other: {
          reviewerCount: [{ label: 'other', value: 1 }],
          satisfaction: [makeSatisfaction('other')],
        },
      },
    }

    const detail: ReportDetail = {
      title: 'AI Report',
      overview: [{ label: 'Project', value: 'Campaign' }],
      intelligence: [{ label: 'Method', value: 'Survey' }],
      quantitative,
      qualitative: {
        commentContent: 'Great product',
        reviews: [{ label: 'user1', content: 'Nice', likes: 5 }],
        commonWords: ['nice', 'gentle'],
      },
      product: [
        {
          label: 'Serum',
          maleComments: [{ title: 'Title', description: 'Desc', commentIds: '1,2' }],
          femaleComments: [{ title: 'F Title', description: 'F Desc', commentIds: '3,4' }],
        },
      ],
      improvement: [
        {
          title: 'Improve texture',
          methods: [{ label: 'Method', value: 'Add hydration' }],
        },
      ],
    }
    const response: ReportDetailResponse = detail
    expect(response.product[0].label).toBe('Serum')
  })
})

describe('AggregationData & daily report', () => {
  const makeStats = (name: string) => ({
    aggregationName: name,
    reviewCount: 1,
    goodRatio: 0.5,
    badRatio: 0.5,
  })

  it('enforces AggregationData composite fields', () => {
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
    expect(stats.femaleTeens.reviewCount).toBe(1)
  })

  it('uses AggregationData inside ReportDailyData/Response', () => {
    const daily: ReportDailyData = {
      productName: 'Serum',
      maker: 'Needs',
      description: 'Hydrating serum',
      projectId: 1,
      projectName: 'Campaign',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      method: 'Survey',
      reviewTargetStart: '2023-12-01',
      reviewTargetEnd: '2023-12-31',
      imageUrl: 'https://example.com/i.jpg',
      updatedDate: '2024-02-01',
      aggregationData: {
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
      },
    }

    const response: ReportDailyResponse = daily
    expect(response.projectName).toBe('Campaign')
  })
})
