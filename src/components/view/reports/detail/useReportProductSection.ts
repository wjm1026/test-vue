import { computed, type Ref } from 'vue'

import type { ProductComments } from '@/api/types/reports'
import type { Improvements, ProductStrengthImprovement } from '@/api/types/reportAIAnalysis'

const extractAgeGroupLabel = (aggregationName: string): string => {
  return aggregationName.replace(/[男女]性$/, '').trim()
}

type AgeGroupData = {
  [K in keyof Improvements]?: Improvements[K]
}

const convertToProductComments = (
  maleGroups: AgeGroupData,
  femaleGroups: AgeGroupData,
): ProductComments[] => {
  const ageGroupKeys = ['young', 'middle', 'mature', 'senior', 'elderly'] as const

  return ageGroupKeys.map((ageKey) => {
    const maleKey = `${ageKey}Male` as keyof typeof maleGroups
    const femaleKey = `${ageKey}Female` as keyof typeof femaleGroups

    const maleGroup = maleGroups[maleKey]
    const femaleGroup = femaleGroups[femaleKey]

    const maleLabel = maleGroup?.aggregationName ?? ''
    const femaleLabel = femaleGroup?.aggregationName ?? ''
    const label = extractAgeGroupLabel(maleLabel || femaleLabel)

    const maleComments =
      maleGroup?.contents
        ?.slice()
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((content) => ({
          title: content.productInsight,
          description: content.detail,
          commentIds: content.commentId.join(','),
          displayOrder: content.displayOrder,
        })) ?? []

    const femaleComments =
      femaleGroup?.contents
        ?.slice()
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((content) => ({
          title: content.productInsight,
          description: content.detail,
          commentIds: content.commentId.join(','),
          displayOrder: content.displayOrder,
        })) ?? []

    return {
      label,
      maleComments,
      femaleComments,
    }
  })
}

const extractGroups = (data: Improvements) => {
  const maleGroups: AgeGroupData = {
    youngMale: data.youngMale,
    middleMale: data.middleMale,
    matureMale: data.matureMale,
    seniorMale: data.seniorMale,
    elderlyMale: data.elderlyMale,
  }
  const femaleGroups: AgeGroupData = {
    youngFemale: data.youngFemale,
    middleFemale: data.middleFemale,
    matureFemale: data.matureFemale,
    seniorFemale: data.seniorFemale,
    elderlyFemale: data.elderlyFemale,
  }
  return { maleGroups, femaleGroups }
}

export function useReportProductSection(
  productStrengthImprovement: Ref<ProductStrengthImprovement | undefined>,
) {
  const strengthsData = computed(() => {
    if (!productStrengthImprovement?.value?.strengths) {
      return []
    }
    const { maleGroups, femaleGroups } = extractGroups(productStrengthImprovement.value.strengths)
    return convertToProductComments(maleGroups, femaleGroups)
  })

  const improvementsData = computed(() => {
    if (!productStrengthImprovement?.value?.improvements) {
      return []
    }
    const { maleGroups, femaleGroups } = extractGroups(
      productStrengthImprovement.value.improvements,
    )
    return convertToProductComments(maleGroups, femaleGroups)
  })

  return {
    strengthsData,
    improvementsData,
  }
}
