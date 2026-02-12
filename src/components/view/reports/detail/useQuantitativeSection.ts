import { computed, type Ref } from 'vue'

import type { QuantitativeEvaluation } from '@/api/types/reportAIAnalysis'
import type { GenderGeneration } from '@/api/types/reports'

type Key = keyof GenderGeneration

interface Chart {
  key: Key
  countLabel: string
  satisfactionLabel: string
}

interface CountData {
  label: string
  value: number
}

interface SatisfactionData {
  label?: string
  good: number
  bad: number
}

interface TotalCount {
  good: number
  bad: number
}

const AGE_KEYS = [
  { camel: 'Teens', snake: 'teens', defaultLabel: '～10代' },
  { camel: '20s', snake: '20s', defaultLabel: '20代' },
  { camel: '30s', snake: '30s', defaultLabel: '30代' },
  { camel: '40s', snake: '40s', defaultLabel: '40代' },
  { camel: '50s', snake: '50s', defaultLabel: '50代' },
  { camel: '60s', snake: '60s', defaultLabel: '60代' },
  { camel: '70s', snake: '70s', defaultLabel: '70代' },
  { camel: '80sPlus', snake: '80s_plus', defaultLabel: '80代～' },
] as const

const GENDER_LABELS = {
  male: '男性',
  female: '女性',
  other: 'その他',
} as const

const CHARTS: Chart[] = [
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
]

function getDataField<T>(
  data: Record<string, T | undefined>,
  camelKey: string,
  snakeKey: string,
  partialCamelKey?: string,
): T | undefined {
  return data[camelKey] ?? (partialCamelKey ? data[partialCamelKey] : undefined) ?? data[snakeKey]
}

function getAgeGroupData<T extends { aggregationName: string }>(
  data: Record<string, T | undefined>,
  ageKey: (typeof AGE_KEYS)[number],
): T | undefined {
  const camelKey = `age${ageKey.camel}`
  const snakeKey = `age_${ageKey.snake}`
  const partialCamelKey = ageKey.snake === '80s_plus' ? 'age_80sPlus' : undefined
  return getDataField(data, camelKey, snakeKey, partialCamelKey)
}

function getGenderAgeGroupData<T extends { aggregationName: string }>(
  data: Record<string, T | undefined>,
  genderKey: Key,
  ageKey: (typeof AGE_KEYS)[number],
): T | undefined {
  const prefix = genderKey === 'male' ? 'male' : genderKey === 'female' ? 'female' : 'other'
  const camelKey = `${prefix}${ageKey.camel}`
  const snakeKey = `${prefix}_${ageKey.snake}`
  const partialCamelKey = ageKey.snake === '80s_plus' ? `${prefix}_80sPlus` : undefined
  return getDataField(data, camelKey, snakeKey, partialCamelKey)
}

export function useQuantitativeSection(
  quantitativeEvaluation: Ref<QuantitativeEvaluation | undefined>,
) {
  const aggregationData = computed(() => quantitativeEvaluation.value?.aggregationData)

  const overallData = computed(() => aggregationData.value?.overall)

  const overallSatisfactionData = computed<SatisfactionData[]>(() => {
    if (!overallData.value) return []
    return [
      {
        good: overallData.value.goodRatio,
        bad: overallData.value.badRatio,
      },
    ]
  })

  const overallTotalCount = computed<TotalCount | undefined>(() => {
    if (!overallData.value) return undefined
    return {
      good: overallData.value.goodReviewCount,
      bad: overallData.value.badReviewCount,
    }
  })

  const sexCountData = computed<CountData[]>(() => {
    if (!aggregationData.value) return []
    const { male, female, other } = aggregationData.value
    return [
      {
        label: male?.aggregationName ?? GENDER_LABELS.male,
        value: male?.reviewCount ?? 0,
      },
      {
        label: female?.aggregationName ?? GENDER_LABELS.female,
        value: female?.reviewCount ?? 0,
      },
      {
        label: other?.aggregationName ?? GENDER_LABELS.other,
        value: other?.reviewCount ?? 0,
      },
    ]
  })

  const sexSatisfactionData = computed<SatisfactionData[]>(() => {
    if (!aggregationData.value) return []
    const { male, female, other } = aggregationData.value
    return [
      {
        label: male?.aggregationName ?? GENDER_LABELS.male,
        good: male?.goodRatio ?? 0,
        bad: male?.badRatio ?? 0,
      },
      {
        label: female?.aggregationName ?? GENDER_LABELS.female,
        good: female?.goodRatio ?? 0,
        bad: female?.badRatio ?? 0,
      },
      {
        label: other?.aggregationName ?? GENDER_LABELS.other,
        good: other?.goodRatio ?? 0,
        bad: other?.badRatio ?? 0,
      },
    ]
  })

  const generationCountData = computed<CountData[]>(() => {
    if (!aggregationData.value) return []
    const data = aggregationData.value as unknown as Record<
      string,
      { aggregationName: string; reviewCount: number } | undefined
    >
    return AGE_KEYS.map((ageKey) => {
      const item = getAgeGroupData(data, ageKey)
      return {
        label: item?.aggregationName ?? ageKey.defaultLabel,
        value: item?.reviewCount ?? 0,
      }
    })
  })

  const generationSatisfactionData = computed<SatisfactionData[]>(() => {
    if (!aggregationData.value) return []
    const data = aggregationData.value as unknown as Record<
      string,
      { aggregationName: string; goodRatio: number; badRatio: number } | undefined
    >
    return AGE_KEYS.map((ageKey) => {
      const item = getAgeGroupData(data, ageKey)
      return {
        label: item?.aggregationName ?? ageKey.defaultLabel,
        good: item?.goodRatio ?? 0,
        bad: item?.badRatio ?? 0,
      }
    })
  })

  const getGenderAgeGroupCountData = (key: Key): CountData[] => {
    if (!aggregationData.value) return []
    const data = aggregationData.value as unknown as Record<
      string,
      { aggregationName: string; reviewCount: number } | undefined
    >
    return AGE_KEYS.map((ageKey) => {
      const item = getGenderAgeGroupData(data, key, ageKey)
      return {
        label: item?.aggregationName ?? ageKey.defaultLabel,
        value: item?.reviewCount ?? 0,
      }
    })
  }

  const getGenderAgeGroupSatisfactionData = (key: Key): SatisfactionData[] => {
    if (!aggregationData.value) return []
    const data = aggregationData.value as unknown as Record<
      string,
      { aggregationName: string; goodRatio: number; badRatio: number } | undefined
    >
    return AGE_KEYS.map((ageKey) => {
      const item = getGenderAgeGroupData(data, key, ageKey)
      return {
        label: item?.aggregationName ?? ageKey.defaultLabel,
        good: item?.goodRatio ?? 0,
        bad: item?.badRatio ?? 0,
      }
    })
  }

  return {
    overallData,
    overallSatisfactionData,
    overallTotalCount,
    sexCountData,
    sexSatisfactionData,
    generationCountData,
    generationSatisfactionData,
    charts: CHARTS,
    getReviewerCount: getGenderAgeGroupCountData,
    getSatisfaction: getGenderAgeGroupSatisfactionData,
  }
}
