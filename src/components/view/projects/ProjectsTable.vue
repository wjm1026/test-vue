<template>
  <ElTable
    size="small"
    stripe
    :data="data ?? []"
    height="auto"
    empty-text="プロジェクトがありません"
    header-cell-class-name="bg-primary100 text-[10px] text-gray700"
    cell-class-name="h-14 text-[11px] text-gray800"
    v-loading="isLoading"
  >
    <ElTableColumn prop="productImageUrl" width="60" class="test">
      <template #default="{ row: { productImageUrl } }">
        <BaseImage :src="productImageUrl" class="mx-auto block h-8 w-8 rounded-sm fit-contain" />
      </template>
    </ElTableColumn>
    <ElTableColumn prop="projectId" width="120">
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
          @click="detailHandle(projectId)"
        >
          {{ projectId }}
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
        <p>{{ formatDate(startDate) }}{{ formatDateRangeEnd(endDate) }}</p>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="productName">
      <template #header>
        <SortHeader
          label="対象商品"
          field="productName"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
      </template>
      <template #default="{ row: { productName, janCode } }">
        <ElText
          class="text-primary600 cursor-pointer text-[11px] underline underline-offset-2"
          @click="productDetailHandle(janCode)"
        >
          {{ productName }}
        </ElText>
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { type SortOrder } from '@/enum'
import type { Project } from '@/api/types/projects'
import SortHeader from '@/components/table/SortHeader.vue'
import { formatDate, formatDateRangeEnd } from '@/util/date-format'
import { routeNames } from '@/router/routes'

defineProps<{
  data?: Project[]
  isLoading: boolean
}>()

const sortField = defineModel<string>('sortField')
const sortOrder = defineModel<SortOrder>('sortOrder')
const router = useRouter()
const detailHandle = (id: string) => {
  router.push({
    name: routeNames.projects.detail,
    params: {
      id,
    },
  })
}

const productDetailHandle = (janCode: string) => {
  router.push({
    name: routeNames.products.detail,
    params: {
      id: janCode,
    },
  })
}
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-table__row--striped > .el-table__cell) {
  @apply !bg-primary;
}
</style>
