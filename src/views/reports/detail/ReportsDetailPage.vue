<template>
  <LayoutMain :show-empty="isEmpty && !isLoading">
    <div class="space-y-10 pb-12 print:space-y-6 print:pb-0">
      <div class="flex justify-between items-center">
        <ElText class="text-gray800 text-2xl font-bold">{{ projectInfo?.projectName }}</ElText>
        <ElText class="text-[16px] font-bold text-gray800">
          更新日：{{ formatDate(projectInfo?.updatedDate ?? '') }}
        </ElText>
      </div>
      <ReportOverviewSection
        :project-info="projectInfo"
        :quantitative-evaluation="quantitativeEvaluation"
      />
      <ReportDownloadSection
        v-if="!isDailyType"
        :project-id="projectInfo?.projectId"
        class="no-print"
      />
      <ReportQuantitativeSection :quantitative-evaluation="quantitativeEvaluation" />
      <ReportQualitativeSection
        v-if="qualitativeEvaluation"
        :qualitative-evaluation="qualitativeEvaluation"
        @open-comments="handleOpenComments"
      />

      <ReportProductSection
        v-if="productStrengthImprovement"
        :product-strength-improvement="productStrengthImprovement"
      />
      <ReportImprovementSection
        v-if="improvementMeasures"
        :improvement-measures="improvementMeasures"
        class="print:break-before-page"
      />
      <div v-if="isLoading" class="loading-overlay" v-loading="isLoading" />
    </div>

    <ReportCommentsDialog
      v-if="isCommentsOpen"
      :rating="rating"
      :projectId="projectInfo?.projectId"
      v-model="isCommentsOpen"
      @closeComments="isCommentsOpen = false"
      class="no-print"
    />
  </LayoutMain>
</template>

<script setup lang="ts">
import { useReportsDetailPage } from './useReportsDetailPage'

import { formatDate } from '@/util/date-format'

const {
  rating,
  isDailyType,
  isLoading,
  isEmpty,
  projectInfo,
  quantitativeEvaluation,
  qualitativeEvaluation,
  productStrengthImprovement,
  improvementMeasures,
  isCommentsOpen,
  handleOpenComments,
} = useReportsDetailPage()
</script>

<style scoped>
@reference '@/style/tailwindcss.css';
.loading-overlay {
  @apply fixed z-50 print:hidden left-[240px] right-0 top-0 bottom-0;
}
</style>
