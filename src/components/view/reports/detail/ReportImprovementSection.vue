<template>
  <div class="space-y-4">
    <ElText class="text-base font-bold block text-gray800">改善点と改善施策</ElText>
    <div
      class="border border-primary300 border-2 rounded-xl bg-primary p-10 grid grid-cols-2 gap-8"
    >
      <div
        class="text-gray800 text-base font-bold border border-primary100 rounded-lg p-6 space-y-6"
      >
        <p>定性評価から見える商品の改善点</p>
        <div class="space-y-5">
          <div
            v-for="(point, index) in sortedImprovementPoints"
            :key="`point-${point.displayOrder}-${index}`"
            class="text-sm space-y-1.5"
          >
            <p class="text-primary600">{{ point.displayOrder }}. {{ point.title }}</p>
            <div class="text-xs font-normal tracking-[2%]">
              {{ point.detail }}
            </div>
          </div>
          <div v-if="sortedImprovementPoints.length === 0" class="text-xs text-gray500">
            データがありません
          </div>
        </div>
      </div>
      <div
        class="text-gray800 text-base font-bold border border-primary100 rounded-lg p-6 space-y-6"
      >
        <p>具体的な改善施策</p>
        <div class="space-y-5">
          <div
            v-for="(strategy, index) in sortedImprovementStrategies"
            :key="`strategy-${strategy.displayOrder}-${index}`"
            class="text-sm space-y-1.5"
          >
            <p class="text-primary600">{{ strategy.displayOrder }}. {{ strategy.title }}</p>
            <div class="text-xs font-normal tracking-[2%]">
              {{ strategy.detail }}
            </div>
          </div>
          <div v-if="sortedImprovementStrategies.length === 0" class="text-xs text-gray500">
            データがありません
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { ElText } from 'element-plus'

import type { Improvement, ImprovementMeasures } from '@/api/types/reportAIAnalysis'

const props = defineProps<{
  improvementMeasures?: ImprovementMeasures
}>()

const { improvementMeasures } = toRefs(props)

const sortByDisplayOrder = (items: Improvement[]): Improvement[] => {
  return [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
}

const sortedImprovementPoints = computed(() => {
  const points = improvementMeasures?.value?.improvementPoints
  if (!points || points.length === 0) {
    return []
  }
  return sortByDisplayOrder(points)
})

const sortedImprovementStrategies = computed(() => {
  const strategies = improvementMeasures?.value?.improvementStrategies
  if (!strategies || strategies.length === 0) {
    return []
  }
  return sortByDisplayOrder(strategies)
})
</script>
