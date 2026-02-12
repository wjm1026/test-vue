<template>
  <ElTable
    size="small"
    stripe
    :data="data ?? []"
    height="100%"
    empty-text="コメントがありません"
    header-cell-class-name="bg-primary100 text-[10px] text-gray700"
    cell-class-name="h-14 text-[11px] text-gray800"
    v-loading="isLoading"
    class="comments-table"
  >
    <ElTableColumn prop="displayFlag" min-width="32" label="">
      <template #default="{ row }">
        <div class="flex items-center justify-center">
          <SuccessIcon :size="12" v-if="getIsVisible(row)" />
          <ErrorIcon :size="12" v-else />
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="displayFlag" min-width="64" label="表示">
      <template #default="{ row }">
        <div class="flex items-center justify-start w-full relative">
          <ElSwitch
            v-show="!loadingDisplayRowIds.has(row.reviewId)"
            :model-value="getIsVisible(row)"
            size="small"
            :disabled="loadingDisplayRowIds.has(row.reviewId)"
            @change="(val: string | number | boolean) => handleVisibleChange(row, val)"
          />
          <ElIcon
            v-if="loadingDisplayRowIds.has(row.reviewId)"
            class="text-primary500 is-loading pointer-events-none"
          >
            <Loading />
          </ElIcon>
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="reviewId" min-width="96">
      <template #header>
        <SortHeader
          label="コメントID"
          field="reviewId"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
      <template #default="{ row }">
        <ElText
          class="text-primary600 cursor-pointer text-[11px] underline underline-offset-2"
          @click="handleCommentClick(row.reviewId)"
        >
          {{ row.reviewId }}
        </ElText>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="comment" min-width="320">
      <template #header>
        <SortHeader
          label="コメント"
          field="comment"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
    </ElTableColumn>
    <ElTableColumn prop="createdAt" min-width="120">
      <template #header>
        <SortHeader
          label="投稿日"
          field="createdAt"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
      <template #default="{ row: { createdAt } }">
        {{ formatDate(createdAt, DATE_TIME_FORMAT) }}
      </template>
    </ElTableColumn>
    <ElTableColumn prop="projectId" min-width="126">
      <template #header>
        <SortHeader
          label="プロジェクトID"
          field="projectId"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
      <template #default="{ row: { projectId } }">
        <ElText
          class="text-primary600 cursor-pointer text-[11px] underline underline-offset-2"
          @click="handleProjectClick(projectId)"
        >
          {{ projectId }}
        </ElText>
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

import type { SortOrder } from '@/enum'
import type { Comment } from '@/api/types/comments'
import SuccessIcon from '@/components/icon/SuccessIcon.vue'
import ErrorIcon from '@/components/icon/ErrorIcon.vue'
import SortHeader from '@/components/table/SortHeader.vue'
import { DATE_TIME_FORMAT } from '@/enum/constants'
import { formatDate } from '@/util/date-format'
import { useCommentsTable } from '@/components/view/comments/useCommentsTable'

defineProps<{
  data?: Comment[]
  isLoading: boolean
}>()

const sortField = defineModel<string>('sortField')
const sortOrder = defineModel<SortOrder>('sortOrder')

const {
  getIsVisible,
  handleVisibleChange,
  handleCommentClick,
  handleProjectClick,
  loadingDisplayRowIds,
} = useCommentsTable()
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

.comments-table {
  @apply h-full w-full;
}

:deep(.el-table) {
  @apply w-full;
  table-layout: fixed;
}

:deep(.el-table__header-wrapper),
:deep(.el-table__body-wrapper) {
  @apply w-full;
}

:deep(.el-table__body-wrapper) {
  @apply flex-1 overflow-auto;
}

:deep(.el-table__row--striped > .el-table__cell) {
  @apply !bg-primary;
}
</style>
