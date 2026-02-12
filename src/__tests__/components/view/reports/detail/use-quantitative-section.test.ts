// generated-by: ai-assist v1.0
// type: unit
// description: Tests for useQuantitativeSection composable covering data transformation, computed values, and edge cases.

import { describe, it, expect } from 'vitest'
import { ref } from 'vue'

import { useQuantitativeSection } from '@/components/view/reports/detail/useQuantitativeSection'
import type { QuantitativeEvaluation } from '@/api/types/reportAIAnalysis'

const sampleQuantitativeEvaluation: QuantitativeEvaluation = {
  aggregationData: {
    overall: {
      aggregationName: '全体',
      reviewCount: 500,
      goodRatio: 80,
      badRatio: 20,
      goodReviewCount: 400,
      badReviewCount: 100,
    },
    male: {
      aggregationName: '男性',
      reviewCount: 250,
      goodRatio: 78,
      badRatio: 22,
    },
    female: {
      aggregationName: '女性',
      reviewCount: 240,
      goodRatio: 82,
      badRatio: 18,
    },
    other: {
      aggregationName: 'その他',
      reviewCount: 10,
      goodRatio: 70,
      badRatio: 30,
    },
    ageTeens: {
      aggregationName: '～10代',
      reviewCount: 30,
      goodRatio: 85,
      badRatio: 15,
    },
    age20s: {
      aggregationName: '20代',
      reviewCount: 100,
      goodRatio: 80,
      badRatio: 20,
    },
    age30s: {
      aggregationName: '30代',
      reviewCount: 120,
      goodRatio: 78,
      badRatio: 22,
    },
    age40s: {
      aggregationName: '40代',
      reviewCount: 90,
      goodRatio: 75,
      badRatio: 25,
    },
    age50s: {
      aggregationName: '50代',
      reviewCount: 70,
      goodRatio: 80,
      badRatio: 20,
    },
    age60s: {
      aggregationName: '60代',
      reviewCount: 50,
      goodRatio: 82,
      badRatio: 18,
    },
    age70s: {
      aggregationName: '70代',
      reviewCount: 30,
      goodRatio: 85,
      badRatio: 15,
    },
    age80sPlus: {
      aggregationName: '80代～',
      reviewCount: 10,
      goodRatio: 90,
      badRatio: 10,
    },
    maleTeens: {
      aggregationName: '男性・～10代',
      reviewCount: 15,
      goodRatio: 83,
      badRatio: 17,
    },
    male20s: {
      aggregationName: '男性・20代',
      reviewCount: 40,
      goodRatio: 77,
      badRatio: 23,
    },
    femaleTeens: {
      aggregationName: '女性・～10代',
      reviewCount: 15,
      goodRatio: 87,
      badRatio: 13,
    },
    female20s: {
      aggregationName: '女性・20代',
      reviewCount: 60,
      goodRatio: 83,
      badRatio: 17,
    },
  } as QuantitativeEvaluation['aggregationData'],
  insight: '全体的に高評価が多く、特に若年層・女性からの支持が高い。',
}

describe('useQuantitativeSection', () => {
  it('returns overallData from aggregationData.overall', () => {
    // Purpose: verify overallData computed property returns overall aggregation data.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { overallData } = useQuantitativeSection(quantitativeEvaluation)

    expect(overallData.value).toEqual({
      aggregationName: '全体',
      reviewCount: 500,
      goodRatio: 80,
      badRatio: 20,
      goodReviewCount: 400,
      badReviewCount: 100,
    })
  })

  it('returns undefined overallData when quantitativeEvaluation is undefined', () => {
    // Purpose: ensure overallData is undefined when input is undefined.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(undefined)
    const { overallData } = useQuantitativeSection(quantitativeEvaluation)

    expect(overallData.value).toBeUndefined()
  })

  it('returns overallSatisfactionData with good and bad ratios', () => {
    // Purpose: verify overallSatisfactionData contains correct ratio values.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { overallSatisfactionData } = useQuantitativeSection(quantitativeEvaluation)

    expect(overallSatisfactionData.value).toEqual([
      {
        good: 80,
        bad: 20,
      },
    ])
  })

  it('returns empty array for overallSatisfactionData when overallData is undefined', () => {
    // Purpose: confirm overallSatisfactionData returns empty array when data is missing.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(undefined)
    const { overallSatisfactionData } = useQuantitativeSection(quantitativeEvaluation)

    expect(overallSatisfactionData.value).toEqual([])
  })

  it('returns overallTotalCount with good and bad review counts', () => {
    // Purpose: verify overallTotalCount contains correct review counts.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { overallTotalCount } = useQuantitativeSection(quantitativeEvaluation)

    expect(overallTotalCount.value).toEqual({
      good: 400,
      bad: 100,
    })
  })

  it('returns undefined overallTotalCount when overallData is undefined', () => {
    // Purpose: ensure overallTotalCount is undefined when data is missing.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(undefined)
    const { overallTotalCount } = useQuantitativeSection(quantitativeEvaluation)

    expect(overallTotalCount.value).toBeUndefined()
  })

  it('returns sexCountData with male, female, and other counts', () => {
    // Purpose: verify sexCountData includes all gender groups with correct values.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { sexCountData } = useQuantitativeSection(quantitativeEvaluation)

    expect(sexCountData.value).toEqual([
      { label: '男性', value: 250 },
      { label: '女性', value: 240 },
      { label: 'その他', value: 10 },
    ])
  })

  it('returns empty array for sexCountData when aggregationData is undefined', () => {
    // Purpose: confirm sexCountData returns empty array when data is missing.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(undefined)
    const { sexCountData } = useQuantitativeSection(quantitativeEvaluation)

    expect(sexCountData.value).toEqual([])
  })

  it('uses default gender labels when aggregationName is missing', () => {
    // Purpose: verify default labels are used when aggregationName is not provided.
    const evaluation = {
      ...sampleQuantitativeEvaluation,
      aggregationData: {
        ...sampleQuantitativeEvaluation.aggregationData,
        male: {
          aggregationName: undefined as unknown as string,
          reviewCount: 100,
          goodRatio: 50,
          badRatio: 50,
        },
      } as QuantitativeEvaluation['aggregationData'],
    }
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(evaluation)
    const { sexCountData } = useQuantitativeSection(quantitativeEvaluation)

    expect(sexCountData.value[0].label).toBe('男性')
  })

  it('returns sexSatisfactionData with good and bad ratios for each gender', () => {
    // Purpose: verify sexSatisfactionData contains correct ratios for all genders.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { sexSatisfactionData } = useQuantitativeSection(quantitativeEvaluation)

    expect(sexSatisfactionData.value).toEqual([
      { label: '男性', good: 78, bad: 22 },
      { label: '女性', good: 82, bad: 18 },
      { label: 'その他', good: 70, bad: 30 },
    ])
  })

  it('returns zero values when gender data is missing', () => {
    // Purpose: ensure zero values are returned when gender data is undefined.
    const evaluation = {
      ...sampleQuantitativeEvaluation,
      aggregationData: {
        ...sampleQuantitativeEvaluation.aggregationData,
        male: undefined,
      } as unknown as QuantitativeEvaluation['aggregationData'],
    }
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(evaluation)
    const { sexCountData, sexSatisfactionData } = useQuantitativeSection(quantitativeEvaluation)

    expect(sexCountData.value[0].value).toBe(0)
    expect(sexSatisfactionData.value[0].good).toBe(0)
    expect(sexSatisfactionData.value[0].bad).toBe(0)
  })

  it('returns generationCountData for all age groups', () => {
    // Purpose: verify generationCountData includes all age groups.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { generationCountData } = useQuantitativeSection(quantitativeEvaluation)

    expect(generationCountData.value.length).toBe(8)
    expect(generationCountData.value[0]).toEqual({ label: '～10代', value: 30 })
    expect(generationCountData.value[1]).toEqual({ label: '20代', value: 100 })
  })

  it('uses default age labels when aggregationName is missing', () => {
    // Purpose: confirm default age labels are used when aggregationName is not provided.
    const evaluation = {
      ...sampleQuantitativeEvaluation,
      aggregationData: {
        ...sampleQuantitativeEvaluation.aggregationData,
        ageTeens: {
          aggregationName: undefined as unknown as string,
          reviewCount: 50,
          goodRatio: 50,
          badRatio: 50,
        },
      } as QuantitativeEvaluation['aggregationData'],
    }
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(evaluation)
    const { generationCountData } = useQuantitativeSection(quantitativeEvaluation)

    expect(generationCountData.value[0].label).toBe('～10代')
  })

  it('returns generationSatisfactionData for all age groups', () => {
    // Purpose: verify generationSatisfactionData includes all age groups with ratios.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { generationSatisfactionData } = useQuantitativeSection(quantitativeEvaluation)

    expect(generationSatisfactionData.value.length).toBe(8)
    expect(generationSatisfactionData.value[0]).toEqual({ label: '～10代', good: 85, bad: 15 })
    expect(generationSatisfactionData.value[1]).toEqual({ label: '20代', good: 80, bad: 20 })
  })

  it('handles snake_case age keys', () => {
    // Purpose: verify composable handles snake_case keys like age_teens.
    const evaluation = {
      ...sampleQuantitativeEvaluation,
      aggregationData: {
        ...sampleQuantitativeEvaluation.aggregationData,
        // Remove camelCase key to test snake_case fallback
        ageTeens: undefined,
        age_teens: {
          aggregationName: '～10代',
          reviewCount: 35,
          goodRatio: 85,
          badRatio: 15,
        },
      } as unknown as QuantitativeEvaluation['aggregationData'],
    }
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(evaluation)
    const { generationCountData } = useQuantitativeSection(quantitativeEvaluation)

    const teensData = generationCountData.value.find((item) => item.label === '～10代')
    expect(teensData?.value).toBe(35)
  })

  it('handles 80sPlus age key variations', () => {
    // Purpose: verify composable handles age_80s_plus and age_80sPlus key variations.
    const evaluation = {
      ...sampleQuantitativeEvaluation,
      aggregationData: {
        ...sampleQuantitativeEvaluation.aggregationData,
        // Remove camelCase key to test snake_case fallback
        age80sPlus: undefined,
        age_80s_plus: {
          aggregationName: '80代～',
          reviewCount: 15,
          goodRatio: 90,
          badRatio: 10,
        },
      } as unknown as QuantitativeEvaluation['aggregationData'],
    }
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(evaluation)
    const { generationCountData } = useQuantitativeSection(quantitativeEvaluation)

    const eightiesData = generationCountData.value.find((item) => item.label === '80代～')
    expect(eightiesData?.value).toBe(15)
  })

  it('returns charts array with correct structure', () => {
    // Purpose: verify charts array contains all gender groups with correct labels.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { charts } = useQuantitativeSection(quantitativeEvaluation)

    expect(charts).toEqual([
      {
        key: 'male',
        countLabel: '男性のレビュー人数',
        satisfactionLabel: '男性のよかった/イマイチ割合',
      },
      {
        key: 'female',
        countLabel: '女性のレビュー人数',
        satisfactionLabel: '女性のよかった/イマイチ割合',
      },
      {
        key: 'other',
        countLabel: 'その他のレビュー人数',
        satisfactionLabel: 'その他のよかった/イマイチ割合',
      },
    ])
  })

  it('getReviewerCount returns count data for male gender', () => {
    // Purpose: verify getReviewerCount returns correct data for male key.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { getReviewerCount } = useQuantitativeSection(quantitativeEvaluation)

    const result = getReviewerCount('male')
    expect(result.length).toBe(8)
    expect(result[0]).toEqual({ label: '男性・～10代', value: 15 })
    expect(result[1]).toEqual({ label: '男性・20代', value: 40 })
  })

  it('getReviewerCount returns count data for female gender', () => {
    // Purpose: verify getReviewerCount returns correct data for female key.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { getReviewerCount } = useQuantitativeSection(quantitativeEvaluation)

    const result = getReviewerCount('female')
    expect(result.length).toBe(8)
    expect(result[0]).toEqual({ label: '女性・～10代', value: 15 })
    expect(result[1]).toEqual({ label: '女性・20代', value: 60 })
  })

  it('getReviewerCount returns count data for other gender', () => {
    // Purpose: verify getReviewerCount returns correct data for other key.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { getReviewerCount } = useQuantitativeSection(quantitativeEvaluation)

    const result = getReviewerCount('other')
    expect(result.length).toBe(8)
    // The label format is "その他・～10代" or just "～10代" if aggregationName is missing
    // Since we don't have other gender-age data in sample, it will use default labels
    expect(result[0].label).toBe('～10代')
  })

  it('getReviewerCount returns empty array when aggregationData is undefined', () => {
    // Purpose: ensure getReviewerCount returns empty array when data is missing.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(undefined)
    const { getReviewerCount } = useQuantitativeSection(quantitativeEvaluation)

    const result = getReviewerCount('male')
    expect(result).toEqual([])
  })

  it('getSatisfaction returns satisfaction data for male gender', () => {
    // Purpose: verify getSatisfaction returns correct ratios for male key.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { getSatisfaction } = useQuantitativeSection(quantitativeEvaluation)

    const result = getSatisfaction('male')
    expect(result.length).toBe(8)
    expect(result[0]).toEqual({ label: '男性・～10代', good: 83, bad: 17 })
    expect(result[1]).toEqual({ label: '男性・20代', good: 77, bad: 23 })
  })

  it('getSatisfaction returns satisfaction data for female gender', () => {
    // Purpose: verify getSatisfaction returns correct ratios for female key.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { getSatisfaction } = useQuantitativeSection(quantitativeEvaluation)

    const result = getSatisfaction('female')
    expect(result.length).toBe(8)
    expect(result[0]).toEqual({ label: '女性・～10代', good: 87, bad: 13 })
    expect(result[1]).toEqual({ label: '女性・20代', good: 83, bad: 17 })
  })

  it('getSatisfaction returns zero ratios when data is missing', () => {
    // Purpose: ensure getSatisfaction returns zero values when gender-age data is undefined.
    const evaluation = {
      ...sampleQuantitativeEvaluation,
      aggregationData: {
        ...sampleQuantitativeEvaluation.aggregationData,
        maleTeens: undefined,
      } as unknown as QuantitativeEvaluation['aggregationData'],
    }
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(evaluation)
    const { getSatisfaction } = useQuantitativeSection(quantitativeEvaluation)

    const result = getSatisfaction('male')
    expect(result[0].good).toBe(0)
    expect(result[0].bad).toBe(0)
  })

  it('handles snake_case gender-age keys', () => {
    // Purpose: verify composable handles snake_case keys like male_teens.
    const evaluation = {
      ...sampleQuantitativeEvaluation,
      aggregationData: {
        ...sampleQuantitativeEvaluation.aggregationData,
        // Remove camelCase key to test snake_case fallback
        maleTeens: undefined,
        male_teens: {
          aggregationName: '男性・～10代',
          reviewCount: 20,
          goodRatio: 85,
          badRatio: 15,
        },
      } as unknown as QuantitativeEvaluation['aggregationData'],
    }
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(evaluation)
    const { getReviewerCount } = useQuantitativeSection(quantitativeEvaluation)

    const result = getReviewerCount('male')
    expect(result[0].value).toBe(20)
  })

  it('reactively updates when quantitativeEvaluation changes', () => {
    // Purpose: verify computed values update reactively when input ref changes.
    const quantitativeEvaluation = ref<QuantitativeEvaluation | undefined>(
      sampleQuantitativeEvaluation,
    )
    const { overallData, sexCountData } = useQuantitativeSection(quantitativeEvaluation)

    expect(overallData.value?.reviewCount).toBe(500)
    expect(sexCountData.value[0].value).toBe(250)

    quantitativeEvaluation.value = {
      ...sampleQuantitativeEvaluation,
      aggregationData: {
        ...sampleQuantitativeEvaluation.aggregationData,
        overall: {
          ...sampleQuantitativeEvaluation.aggregationData.overall,
          reviewCount: 600,
        },
        male: {
          ...sampleQuantitativeEvaluation.aggregationData.male,
          reviewCount: 300,
        },
      } as QuantitativeEvaluation['aggregationData'],
    }

    expect(overallData.value?.reviewCount).toBe(600)
    expect(sexCountData.value[0].value).toBe(300)
  })
})
