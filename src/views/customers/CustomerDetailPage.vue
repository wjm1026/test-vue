<template>
  <LayoutMain
    :total="commentList?.totalCount"
    :show-pagination="true"
    :page="page"
    :show-empty="isEmpty && !isLoading"
    @page-change="pageChange"
  >
    <template #title>
      <div class="flex items-center gap-3">
        <StatusLabel v-if="customerDetail?.status" :status="customerDetail.status" />
        <ElText class="text-gray800 text-2xl font-bold">
          {{ customerDetail?.nickname }}（ID：{{ customerDetail?.userId }}）
        </ElText>
      </div>
    </template>
    <div class="flex flex-col gap-8 h-full" v-loading="isLoading">
      <div class="flex flex-col gap-6 flex-1 min-h-0">
        <CustomerInfoCard
          v-if="customerDetail"
          :customer="customerDetail"
          :isLoading="isLoadingDetail && !isLoadingComments"
        />
        <div class="flex flex-col gap-4 flex-1 min-h-0">
          <ElText class="text-gray800 text-xs font-bold self-start">コメント一覧</ElText>
          <div class="flex flex-col gap-6 flex-1 min-h-0">
            <SearchInput
              placeholder="コメントID、ワード、プロジェクトIDで検索"
              v-model="searchKeyword"
            />
            <div class="flex flex-col gap-5 flex-1 min-h-0">
              <div class="comment-tabs-wrapper">
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
              <div class="flex flex-col gap-3 flex-1 min-h-0">
                <ElText class="text-gray800 text-xs font-bold self-start">
                  全{{ commentList?.totalCount ?? 0 }}件
                </ElText>
                <CustomerCommentsTable
                  class="flex-1 min-h-0"
                  :data="commentList?.comments"
                  :is-loading="isLoadingComments && !isLoadingDetail"
                  v-model:sortField="sortField"
                  v-model:sortOrder="sortOrder"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #pagination-left>
      <WhiteButton
        label="全てのコメントを非表示にする"
        className="h-8 px-3 text-[11px] border-error text-error hover:bg-error-bg"
        @click="handleHideAllComments"
      />
    </template>
  </LayoutMain>
</template>

<script setup lang="ts">
import { useCustomerDetailPage } from './useCustomerDetailPage'

import LayoutMain from '@/components/layout/LayoutMain.vue'
import StatusLabel from '@/components/view/customers/StatusLabel.vue'
import CustomerInfoCard from '@/components/view/customers/CustomerInfoCard.vue'
import CustomerCommentsTable from '@/components/view/customers/CustomerCommentsTable.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import WhiteButton from '@/components/button/WhiteButton.vue'

const {
  customerDetail,
  commentList,
  isLoadingDetail,
  isLoadingComments,
  isLoading,
  isEmpty,
  page,
  searchKeyword,
  activeTab,
  sortField,
  sortOrder,
  pageChange,
  handleHideAllComments,
  tabs,
} = useCustomerDetailPage()
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

.comment-tabs-wrapper {
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
