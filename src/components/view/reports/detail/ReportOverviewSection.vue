<template>
  <div class="flex justify-between rounded-lg border border-gray300 py-8 px-10">
    <div class="w-[270px]">
      <ElText class="text-[12px] font-medium text-gray800">プロジェクト概要</ElText>
      <div class="flex flex-col gap-2 mt-3">
        <div class="flex items-center h-[17px] leading-[17px]">
          <ElText class="w-14 self-start text-[11px] text-gray700">実施期間</ElText>
          <ElText class="flex-1 pl-3 text-[11px] text-gray800">
            {{ formatDateRange(projectInfo?.startDate, projectInfo?.endDate) }}
          </ElText>
        </div>
        <div class="flex items-center h-[17px] leading-[17px]">
          <ElText class="w-14 self-start text-[11px] text-gray700">対象商品</ElText>
          <ElText class="flex-1 pl-3 text-[11px] text-gray800">{{
            projectInfo?.productName || '-'
          }}</ElText>
        </div>
        <div class="flex items-center h-[17px] leading-[17px]">
          <ElText class="w-14 self-start text-[11px] text-gray700">対象者</ElText>
          <ElText class="flex-1 pl-3 text-[11px] text-gray800">
            {{
              formatDateRange(projectInfo?.reviewTargetStart, projectInfo?.reviewTargetEnd)
            }}の購入者
          </ElText>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <ElText class="text-[12px] font-medium text-gray800">商品情報</ElText>
      <div class="flex gap-5 mt-3">
        <BaseImage class="w-30 h-30 rounded-[6px]" :src="projectInfo?.imageUrl || ''" />
        <div class="flex-1 flex flex-col gap-2 mt-3">
          <div class="flex items-center">
            <ElText class="w-14 self-start text-[11px] text-gray700">商品名</ElText>
            <ElText class="flex-1 pl-3 text-[11px] text-gray800">{{
              projectInfo?.productName || '-'
            }}</ElText>
          </div>
          <div class="flex items-center">
            <ElText class="w-14 self-start text-[11px] text-gray700">メーカー名</ElText>
            <ElText class="flex-1 pl-3 text-[11px] text-gray800">{{
              projectInfo?.maker || '-'
            }}</ElText>
          </div>
          <div class="flex items-center">
            <ElText class="w-14 self-start text-[11px] text-gray700">商品説明</ElText>
            <ElText class="flex-1 pl-3 text-[11px] text-gray800">{{
              projectInfo?.description || '-'
            }}</ElText>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ProjectInfo, QuantitativeEvaluation } from '@/api/types/reportAIAnalysis'
import { formatDate } from '@/util/date-format'

defineProps<{
  projectInfo?: ProjectInfo
  quantitativeEvaluation?: QuantitativeEvaluation
}>()

const formatDateRange = (startDate?: Date | string, endDate?: Date | string) => {
  if (!startDate || !endDate) return '-'
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}
</script>
