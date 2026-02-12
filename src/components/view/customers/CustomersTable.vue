<template>
  <ElTable
    size="small"
    stripe
    :data="data ?? []"
    :height="height"
    v-loading="isLoading"
    empty-text="顧客がありません"
    header-cell-class-name="bg-primary100 text-[10px] text-gray700"
    cell-class-name="h-14 text-[11px] text-gray800"
    class="w-full"
  >
    <ElTableColumn prop="userId" minWidth="96" className="pl-4">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="顧客ID"
          field="userId"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>顧客ID</p>
      </template>
      <template #default="{ row: { userId } }">
        <ElText
          class="text-primary600 cursor-pointer text-[11px] underline underline-offset-2"
          @click="handleCustomerClick(userId)"
        >
          {{ userId }}
        </ElText>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="nickname" minWidth="200">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="ニックネーム"
          field="nickname"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>ニックネーム</p>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="ageGroup" minWidth="96">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="年齢層"
          field="ageGroup"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>年齢層</p>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="gender" minWidth="96">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="性別"
          field="gender"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>性別</p>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="totalReviews" minWidth="97">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="レビュー数"
          field="totalReviews"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>レビュー数</p>
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import type { SortOrder } from '@/enum'
import type { Customer } from '@/api/types/customers'
import SortHeader from '@/components/table/SortHeader.vue'
import { routeNames } from '@/router/routes'

const router = useRouter()

withDefaults(
  defineProps<{
    data?: Customer[]
    isSort?: boolean
    height?: string
    isLoading?: boolean
  }>(),
  {
    isSort: true,
    height: 'auto',
    isLoading: false,
  },
)

const sortField = defineModel<string>('sortField')
const sortOrder = defineModel<SortOrder>('sortOrder')

const handleCustomerClick = (userId: string) => {
  router.push({
    name: routeNames.customers.detail,
    params: {
      id: userId,
    },
  })
}
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

.customers-table {
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
