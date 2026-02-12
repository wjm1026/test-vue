<template>
  <div>
    <ElTable
      v-bind="$attrs"
      :data="data"
      :span-method="objectSpanMethod"
      border
      header-cell-class-name="bg-primary100 text-xs font-medium text-gray800"
      cell-class-name="h-14 text-xs text-gray800"
    >
      <ElTableColumn prop="label" width="100"></ElTableColumn>

      <ElTableColumn :label="maleLabel">
        <template #default="scope">
          <div class="text-left">
            <span class="font-bold">
              <template v-if="scope.row.maleDisplayOrder">
                {{ scope.row.maleDisplayOrder }}.
              </template>
              {{ scope.row.maleCommentTitle }}
            </span>
            <p>
              {{ scope.row.maleDescription }}
            </p>
          </div>
        </template>
      </ElTableColumn>

      <ElTableColumn prop="maleCommentIds" :label="commentIdLabel" width="120">
        <template #default="scope">
          <p class="text-primary600 font-bold underline">
            {{ scope.row.maleCommentIds }}
          </p>
        </template>
      </ElTableColumn>
      <ElTableColumn :label="femaleLabel">
        <template #default="scope">
          <div class="text-left">
            <span class="font-bold">
              <template v-if="scope.row.femaleDisplayOrder">
                {{ scope.row.femaleDisplayOrder }}.
              </template>
              {{ scope.row.femaleCommentTitle }}
            </span>
            <p>
              {{ scope.row.femaleDescription }}
            </p>
          </div>
        </template>
      </ElTableColumn>

      <ElTableColumn prop="femaleCommentIds" :label="commentIdLabel" width="120">
        <template #default="scope">
          <p class="text-primary600 font-bold underline">
            {{ scope.row.femaleCommentIds }}
          </p>
        </template>
      </ElTableColumn>

      <slot name="additional-columns"></slot>
    </ElTable>
  </div>
</template>

<script setup lang="ts">
import { useReportCommentsTable } from './useReportCommentsTable'

import type { ProductComments } from '@/api/types/reports'

interface TableProps {
  data: ProductComments[]
  maleLabel?: string
  femaleLabel?: string
  commentIdLabel?: string
}

const props = withDefaults(defineProps<TableProps>(), {
  maleLabel: '男性',
  femaleLabel: '女性',
  commentIdLabel: '参照コメントID',
})

const { data, objectSpanMethod } = useReportCommentsTable(props)
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-table .el-table__cell) {
  @apply align-baseline;
}

:deep(.el-table__body tr:hover > td) {
  @apply bg-transparent;
}
</style>
