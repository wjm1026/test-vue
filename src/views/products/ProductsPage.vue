<template>
  <LayoutMain
    title="商品管理"
    :total="productList?.total"
    :show-pagination="true"
    :page="page"
    @page-change="pageChange"
    :show-back-button="false"
  >
    <div class="flex flex-col gap-8 h-full">
      <AddButton label="個別登録" @click="productAdd" />
      <div class="flex flex-col gap-6 flex-1 min-h-0">
        <SearchInput
          placeholder="商品名、メーカー名、JANコードで絞り込み"
          v-model="searchKeyword"
        />
        <div class="flex flex-col gap-3 flex-1 overflow-auto">
          <ElText class="self-start text-xs font-bold text-gray800">
            全{{ productList?.total }}商品
          </ElText>
          <ProductsTable
            class="h-full"
            :data="productList?.products"
            :isLoading="isLoading"
            v-model:sortField="sortField"
            v-model:sortOrder="sortOrder"
          />
        </div>
      </div>
    </div>
  </LayoutMain>
</template>

<script setup lang="ts">
import { useProductsPage } from './useProductsPage'

import AddButton from '@/components/button/AddButton.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import LayoutMain from '@/components/layout/LayoutMain.vue'
import ProductsTable from '@/components/view/products/ProductsTable.vue'

const {
  productList,
  page,
  searchKeyword,
  pageChange,
  productAdd,
  sortField,
  sortOrder,
  isLoading,
} = useProductsPage()
</script>
