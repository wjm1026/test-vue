<template>
  <ElTable
    size="small"
    stripe
    :data="data ?? []"
    :height="height"
    v-loading="isLoading"
    empty-text="商品がありません"
    header-cell-class-name="bg-primary100 text-[10px] text-gray700"
    cell-class-name="h-14 text-[11px] text-gray800"
  >
    <ElTableColumn v-if="$slots.actionColumn" width="48">
      <template #default="{ row }">
        <div class="flex items-center justify-center">
          <slot name="actionColumn" :row="row" />
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="productImageUrl" width="60">
      <template #default="{ row: { productImageUrl } }">
        <BaseImage :src="productImageUrl" class="mx-auto block h-8 w-8 rounded-sm" fit="contain" />
      </template>
    </ElTableColumn>
    <ElTableColumn prop="productName" width="280">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="商品名"
          field="productName"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>商品名</p>
      </template>
      <template #default="{ row: { janCode, productName } }">
        <ElText
          v-if="isDetail"
          class="text-primary600 cursor-pointer text-[11px] underline underline-offset-2"
          @click="productDetailHandle(janCode)"
        >
          {{ productName }}
        </ElText>
        <ElText v-else class="text-[11px]">{{ productName }}</ElText>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="maker">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="メーカー名"
          field="maker"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>メーカー名</p>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="janCode">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="JANコード"
          field="janCode"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>JANコード</p>
      </template>
    </ElTableColumn>
    <ElTableColumn>
      <template #header>
        <SortHeader
          v-if="isSort"
          label="登録日"
          field="createdAt"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>登録日</p>
      </template>
      <template #default="{ row: { createdAt } }">
        <p>{{ formatDate(createdAt) }}</p>
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<script setup lang="ts">
import { useProductsTable } from './useProductsTable'

import type { SortOrder } from '@/enum'
import type { Product } from '@/api/types/products'
import SortHeader from '@/components/table/SortHeader.vue'
import { formatDate } from '@/util/date-format'

withDefaults(
  defineProps<{
    data?: Product[]
    isSort?: boolean
    isDetail?: boolean
    height?: string
    isLoading?: boolean
  }>(),
  {
    isSort: true,
    isDetail: true,
    height: 'auto',
    isLoading: false,
  },
)

const sortField = defineModel<string>('sortField')
const sortOrder = defineModel<SortOrder>('sortOrder')

const { productDetailHandle } = useProductsTable()
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-table__row--striped > .el-table__cell) {
  @apply !bg-primary;
}
</style>
