<template>
  <div class="space-y-4 print:break-before-page">
    <div
      class="border border-gray300 rounded-xl text-gray800 bg-gray100 px-10 py-8 space-y-6 print:border-0 print:bg-transparent print:p-0 print:rounded-none"
    >
      <ElText class="text-base font-bold mb-6 block">商品の強み</ElText>
      <ReportCommentsTable :data="strengthsData" />
      <ElText class="text-base font-bold mb-6 block">商品の改善点</ElText>
      <ReportCommentsTable :data="improvementsData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

import { useReportProductSection } from './useReportProductSection'

import type { ProductStrengthImprovement } from '@/api/types/reportAIAnalysis'

const props = defineProps<{
  productStrengthImprovement?: ProductStrengthImprovement
}>()
const { productStrengthImprovement } = toRefs(props)

const { strengthsData, improvementsData } = useReportProductSection(productStrengthImprovement)
</script>
