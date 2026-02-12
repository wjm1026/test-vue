<template>
  <BaseDialog
    v-model="targetProductVisible"
    :width="800"
    className="h-[672px]"
    dialogTitle="対象商品設定"
    @close="handleCancel"
  >
    <template #main>
      <SearchInput placeholder="商品名、メーカー名、JANコードで絞り込み" v-model="searchKeyword" />
      <div class="mt-5 flex w-full flex-1 flex-col gap-3 overflow-auto" v-loading="isLoading">
        <ElText v-if="!searchKeyword" class="text-gray800 self-start text-xs font-bold">
          全{{ productList?.total }}商品
        </ElText>
        <div class="flex h-[17px] items-center gap-5 leading-[17px]" v-else>
          <ElText class="text-gray800 self-start text-xs font-bold">
            絞り込み結果：{{ productList?.total }}件
          </ElText>
          <div class="flex items-center">
            <ElText class="text-gray700 mr-1 text-[11px] font-medium">
              選択中の商品のみ表示
            </ElText>
            <ElCheckbox v-model="isProductSelect" size="small" @change="changeSelect" />
          </div>
        </div>
        <ProductsTable
          class="h-full"
          :data="productData"
          :isDetail="false"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        >
          <template #actionColumn="{ row }">
            <BaseRadio :value="row.janCode" v-model="janCode" @change="handleRadioChange">
            </BaseRadio>
          </template>
        </ProductsTable>
        <div class="flex justify-end">
          <ElPagination
            layout="prev, pager, next"
            :total="pageTotal"
            :current-page="page"
            @current-change="pageChange"
          />
        </div>
      </div>
      <div class="mt-8 self-end">
        <WhiteButton label="キャンセル" class="ml-0 h-10 w-[120px]" @click="handleCancel" />
        <BlueButton
          label="設定する"
          class="h-10 w-[120px]"
          @click="handleSetup"
          :disabled="disabled"
        />
      </div>
    </template>
  </BaseDialog>
</template>
<script setup lang="ts">
import { useTargetProductDialog } from './useTargetProductDialog'

import type { Product } from '@/api/types/products'

const props = defineProps<{
  modelValue: boolean
  janCode: string
  product?: Product
}>()

const emit = defineEmits(['closeTargetProduct', 'chooseTargetProduct'])
const {
  targetProductVisible,
  searchKeyword,
  productList,
  productData,
  sortField,
  sortOrder,
  janCode,
  disabled,
  isProductSelect,
  isLoading,
  page,
  pageTotal,
  pageChange,
  handleRadioChange,
  handleCancel,
  handleSetup,
  changeSelect,
} = useTargetProductDialog(props, emit)
</script>
