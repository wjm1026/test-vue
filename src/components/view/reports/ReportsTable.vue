<template>
  <ElTable
    size="small"
    stripe
    :data="data ?? []"
    height="auto"
    empty-text="調査レポートがありません"
    header-cell-class-name="bg-primary100 text-[10px] text-gray700"
    cell-class-name="h-14 text-[11px] text-gray800"
    v-loading="isLoading"
  >
    <ElTableColumn prop="imageUrl" width="60" class="test">
      <template #default="{ row: { imageUrl } }">
        <BaseImage :src="imageUrl" class="mx-auto block h-8 w-8 rounded-sm fit-contain" />
      </template>
    </ElTableColumn>
    <ElTableColumn prop="reportId" width="96">
      <template #header>
        <SortHeader
          label="レポートID"
          field="reportId"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
      <template #default="{ row: { reportId, projectId } }">
        <ElText
          class="text-primary600 cursor-pointer text-[11px] underline underline-offset-2"
          @click="reportDetailHandle(projectId)"
        >
          {{ reportId }}
        </ElText>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="projectName">
      <template #header>
        <SortHeader
          label="プロジェクト名"
          field="projectName"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
    </ElTableColumn>
    <ElTableColumn prop="productName">
      <template #header>
        <SortHeader
          label="商品名"
          field="productName"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
    </ElTableColumn>
    <ElTableColumn>
      <template #header>
        <SortHeader
          label="評価数（日次）"
          field="reviewCount"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
      <template #default="{ row: { reviewCount, projectId } }">
        <ElText
          class="text-primary600 cursor-pointer text-[11px] underline underline-offset-2"
          @click="reportDailyHandle(projectId)"
        >
          {{ formatNumberWithCommas(reviewCount) }}
        </ElText>
      </template>
    </ElTableColumn>
    <ElTableColumn>
      <template #header>
        <SortHeader
          label="コメント数（日次）"
          field="commentCount"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
      <template #default="{ row: { commentCount, projectId } }">
        <ElText
          class="text-primary600 cursor-pointer text-[11px] underline underline-offset-2"
          @click="reportDailyHandle(projectId)"
        >
          {{ formatNumberWithCommas(commentCount) }}
        </ElText>
      </template>
    </ElTableColumn>
    <ElTableColumn>
      <template #header>
        <SortHeader
          label="よかった割合"
          field="goodRatio"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
      <template #default="{ row: { goodRatio } }">
        <p>{{ goodRatio }}%</p>
      </template>
    </ElTableColumn>
    <ElTableColumn>
      <template #header>
        <SortHeader
          label="実施期間"
          field="startDate"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
      <template #default="{ row: { startDate, endDate } }">
        <p>{{ formatDate(startDate) }} {{ formatDateRangeEnd(endDate) }}</p>
      </template>
    </ElTableColumn>
  </ElTable>
</template>
<script setup lang="ts">
import { useReportsTable } from './useReportsTable'

import type { Report } from '@/api/types/reports'
import type { SortOrder } from '@/enum'
import { formatDate, formatDateRangeEnd } from '@/util/date-format'
import { formatNumberWithCommas } from '@/util/form-data-helper'

withDefaults(
  defineProps<{
    data?: Report[]
    isLoading?: boolean
  }>(),
  {
    isLoading: false,
  },
)
const sortField = defineModel<string>('sortField')
const sortOrder = defineModel<SortOrder>('sortOrder')

const { reportDetailHandle, reportDailyHandle } = useReportsTable()
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-table__row--striped > .el-table__cell) {
  @apply !bg-primary;
}
</style>
