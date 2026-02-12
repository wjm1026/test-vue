<template>
  <LayoutMain
    title="顧客管理"
    :total="customerList?.total"
    :show-pagination="true"
    :page="page"
    @page-change="pageChange"
    :show-back-button="false"
  >
    <div class="flex flex-col gap-8 h-full">
      <div class="flex flex-col gap-6 flex-1 min-h-0">
        <SearchInput placeholder="顧客ID、ニックネームで絞り込み" v-model="searchKeyword" />
        <div class="flex flex-col gap-3 flex-1 min-h-0">
          <div class="customers-tabs-wrapper">
            <div class="flex gap-2 px-3">
              <button
                v-for="tab in tabs"
                :key="tab.name"
                :class="[
                  'tab-button',
                  activeTab === tab.name ? 'tab-button-active' : 'tab-button-inactive',
                ]"
                @click="activeTab = tab.name"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-3 flex-1 overflow-auto">
            <ElText class="self-start text-xs font-bold text-gray800">
              全{{ customerList?.total ?? 0 }}人
            </ElText>
            <CustomersTable
              class="h-full"
              :data="customerList?.users"
              :isLoading="isLoading"
              v-model:sortField="sortField"
              v-model:sortOrder="sortOrder"
            />
          </div>
        </div>
      </div>
    </div>
  </LayoutMain>
</template>

<script setup lang="ts">
import { useCustomersPage } from './useCustomersPage'

import SearchInput from '@/components/input/SearchInput.vue'
import LayoutMain from '@/components/layout/LayoutMain.vue'
import CustomersTable from '@/components/view/customers/CustomersTable.vue'

const {
  customerList,
  page,
  searchKeyword,
  sortField,
  sortOrder,
  activeTab,
  isLoading,
  pageChange,
} = useCustomersPage()

const tabs = [
  { label: 'すべて', name: 'all' },
  // TODO:Feature to handle in Phase 2
  // { label: 'アカウント停止中', name: 'suspended' },
]
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

.customers-tabs-wrapper {
  @apply border-b-2 border-primary500;
}

.tab-button {
  @apply h-8 w-[160px] text-xs font-bold border border-primary500 rounded-t-sm;
  @apply border-b-0;
  @apply text-primary500;
  @apply bg-white;
  @apply cursor-pointer;
  @apply transition-colors;
}

.tab-button-active {
  @apply bg-primary500 text-white;
}

.tab-button-inactive {
  @apply hover:bg-primary100;
}
</style>
