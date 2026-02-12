<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <ElText class="text-base font-bold block text-gray800">定量評価</ElText>
      <ElLink
        v-if="route.query.type !== 'daily'"
        :underline="false"
        @click="handleDailyCheck"
        class="text-primary600 text-[12px] font-bold flex items-center"
      >
        日次データの確認
        <ElIcon :size="18"><ArrowRightIcon /></ElIcon>
      </ElLink>
    </div>

    <QuantitativeCard label="全体">
      <div class="text-sm">
        <div class="mb-3">
          <span class="font-bold">レビュー人数</span>
          <span class="ml-3 mr-1">計</span>
          <span class="text-base font-medium">{{ overallData?.reviewCount ?? 0 }}</span>
          <span class="text-xs font-medium">人</span>
        </div>
        <ReviewSatisfactionChart
          class="h-[50px]"
          :isShowTotal="true"
          :isShowLabel="false"
          :data="overallSatisfactionData"
          :totalCount="overallTotalCount"
          unit="人"
        />
      </div>
      <div class="text-sm">
        <span class="font-bold">インサイト</span>
        <div class="tracking-[2%]">{{ quantitativeEvaluation?.insight ?? '' }}</div>
      </div>
    </QuantitativeCard>

    <QuantitativeCard label="性別">
      <div class="flex gap-6">
        <div class="flex-1 space-y-5">
          <p class="text-sm font-bold">レビュー人数</p>
          <ReviewCountChart :data="sexCountData" unit="人" />
        </div>
        <div class="flex-1 space-y-5">
          <p class="text-sm font-bold">よかった/イマイチ割合</p>
          <ReviewSatisfactionChart :data="sexSatisfactionData" />
        </div>
      </div>
    </QuantitativeCard>

    <QuantitativeCard label="世代別" class="print:break-before-page">
      <div class="flex gap-6">
        <div class="flex-1 space-y-5">
          <p class="text-sm font-bold">レビュー人数</p>
          <ReviewCountChart :data="generationCountData" unit="人" />
        </div>
        <div class="flex-1 space-y-5">
          <p class="text-sm font-bold">よかった/イマイチ割合</p>
          <ReviewSatisfactionChart :data="generationSatisfactionData" />
        </div>
      </div>
    </QuantitativeCard>

    <QuantitativeCard label="性別×世代別" class="print:break-before-page">
      <div class="grid grid-cols-3 gap-x-5 gap-y-8">
        <template v-for="item in charts" :key="item.key">
          <div class="flex-1 space-y-5">
            <p class="text-sm font-bold">{{ item.countLabel }}</p>
            <ReviewCountChart :data="getReviewerCount(item.key)" unit="人" />
          </div>
        </template>
        <template v-for="item in charts" :key="item.key">
          <div class="flex-1 space-y-5">
            <p class="text-sm font-bold">{{ item.satisfactionLabel }}</p>
            <ReviewSatisfactionChart :data="getSatisfaction(item.key)" />
          </div>
        </template>
      </div>
    </QuantitativeCard>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useQuantitativeSection } from './useQuantitativeSection'

import type { QuantitativeEvaluation } from '@/api/types/reportAIAnalysis'

const props = defineProps<{
  quantitativeEvaluation?: QuantitativeEvaluation
}>()

const route = useRoute()
const router = useRouter()
const { quantitativeEvaluation } = toRefs(props)

const handleDailyCheck = () => {
  router.push(`${route.path}?type=daily`)
}

const {
  overallData,
  overallSatisfactionData,
  overallTotalCount,
  sexCountData,
  sexSatisfactionData,
  generationCountData,
  generationSatisfactionData,
  charts,
  getReviewerCount,
  getSatisfaction,
} = useQuantitativeSection(quantitativeEvaluation)
</script>
