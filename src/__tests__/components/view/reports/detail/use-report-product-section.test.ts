// generated-by: ai-assist v1.0
// type: unit
// description: useReportProductSection tests ensuring strengths/improvements are transformed and sorted.

import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import type { ProductStrengthImprovement } from '@/api/types/reportAIAnalysis'
import { useReportProductSection } from '@/components/view/reports/detail/useReportProductSection'

const baseImprovement = (): ProductStrengthImprovement => ({
  strengths: {
    youngMale: {
      aggregationName: '若年男性',
      contents: [
        {
          productInsight: '男性1',
          detail: '詳細1',
          displayOrder: 2,
          commentId: [1, 2],
        },
        {
          productInsight: '男性2',
          detail: '詳細2',
          displayOrder: 1,
          commentId: [3],
        },
      ],
    },
    youngFemale: {
      aggregationName: '若年女性',
      contents: [
        {
          productInsight: '女性1',
          detail: '詳細A',
          displayOrder: 1,
          commentId: [4],
        },
      ],
    },
    middleMale: { aggregationName: '中年男性', contents: [] },
    matureMale: { aggregationName: '壮年男性', contents: [] },
    seniorMale: { aggregationName: '高齢男性', contents: [] },
    elderlyMale: { aggregationName: '老年男性', contents: [] },
    middleFemale: { aggregationName: '中年女性', contents: [] },
    matureFemale: { aggregationName: '壮年女性', contents: [] },
    seniorFemale: { aggregationName: '高齢女性', contents: [] },
    elderlyFemale: { aggregationName: '老年女性', contents: [] },
  },
  improvements: {
    youngMale: { aggregationName: '若年男性', contents: [] },
    youngFemale: { aggregationName: '若年女性', contents: [] },
    middleMale: { aggregationName: '中年男性', contents: [] },
    matureMale: { aggregationName: '壮年男性', contents: [] },
    seniorMale: { aggregationName: '高齢男性', contents: [] },
    elderlyMale: { aggregationName: '老年男性', contents: [] },
    middleFemale: { aggregationName: '中年女性', contents: [] },
    matureFemale: { aggregationName: '壮年女性', contents: [] },
    seniorFemale: { aggregationName: '高齢女性', contents: [] },
    elderlyFemale: { aggregationName: '老年女性', contents: [] },
  },
})

describe('useReportProductSection', () => {
  it('transforms strengths and improvements data into product comments', () => {
    const productRef = ref<ProductStrengthImprovement | undefined>(baseImprovement())

    const { strengthsData, improvementsData } = useReportProductSection(productRef)

    expect(strengthsData.value[0]?.label).toBe('若年')
    expect(strengthsData.value[0]?.maleComments[0]).toEqual({
      title: '男性2',
      description: '詳細2',
      commentIds: '3',
      displayOrder: 1,
    })
    expect(strengthsData.value[0]?.maleComments[1]).toEqual({
      title: '男性1',
      description: '詳細1',
      commentIds: '1,2',
      displayOrder: 2,
    })
    expect(strengthsData.value[0]?.femaleComments[0].title).toBe('女性1')

    expect(improvementsData.value).toHaveLength(5)
  })

  it('returns empty arrays when productStrengthImprovement is undefined', () => {
    const productRef = ref<ProductStrengthImprovement | undefined>(undefined)

    const { strengthsData, improvementsData } = useReportProductSection(productRef)

    expect(strengthsData.value).toEqual([])
    expect(improvementsData.value).toEqual([])
  })
})
