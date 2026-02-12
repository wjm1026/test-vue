<template>
  <LayoutMain
    title="コメント管理"
    :total="commentList?.totalCount"
    :show-pagination="true"
    :page="page"
    @page-change="pageChange"
    :show-back-button="false"
  >
    <div class="flex h-full flex-col gap-8">
      <div class="flex min-h-0 flex-1 flex-col gap-6">
        <SearchInput
          placeholder="コメントID、ワード、プロジェクトID、ユーザーIDで検索"
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
          <div class="flex flex-col gap-1.5">
            <ElText class="text-gray800 text-xs font-bold self-start">絞り込み</ElText>
            <div class="flex items-center gap-3">
              <ElCheckboxGroup v-model="filterList">
                <BaseCheckbox label="表示コメント" value="visible" />
                <BaseCheckbox label="非表示コメント" value="hidden" />
              </ElCheckboxGroup>
            </div>
          </div>
          <div class="flex flex-col gap-3 flex-1 min-h-0">
            <ElText class="text-gray800 text-xs font-bold self-start">
              全{{ commentList?.totalCount ?? 0 }}コメント
            </ElText>
            <div class="flex-1 min-h-0">
              <CommentsTable
                :data="commentList?.comments"
                :isLoading="isLoading"
                v-model:sortField="sortField"
                v-model:sortOrder="sortOrder"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #pagination-left>
      <WhiteButton
        :label="checkAllButtonLabel"
        :is-loading="isCheckAllLoading"
        class="ml-0"
        className="h-8 px-3 text-[11px] border-error text-error hover:bg-error-bg"
        @click="toggleCheckAll"
      />
      <WhiteButton
        label="CSVをダウンロードする"
        className="h-8 px-3 text-[11px] self-start"
        :is-loading="isDownloading"
        @click="handleCSVDownload"
      >
        <template #prefix>
          <ElIcon size="16" class="mr-1">
            <UploadIcon />
          </ElIcon>
        </template>
      </WhiteButton>
    </template>
  </LayoutMain>
</template>

<script setup lang="ts">
import { useCommentsPage } from './useCommentsPage'

import UploadIcon from '@/components/icon/UploadIcon.vue'
import WhiteButton from '@/components/button/WhiteButton.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import BaseCheckbox from '@/components/form/BaseCheckbox.vue'
import CommentsTable from '@/components/view/comments/CommentsTable.vue'
import LayoutMain from '@/components/layout/LayoutMain.vue'

const {
  searchKeyword,
  activeTab,
  filterList,
  commentList,
  isLoading,
  page,
  sortField,
  sortOrder,
  pageChange,
  handleCSVDownload,
  toggleCheckAll,
  checkAllButtonLabel,
  isCheckAllLoading,
  isDownloading,
} = useCommentsPage()

const tabs = [
  { label: '未チェック', name: 'unchecked' },
  { label: 'すべて', name: 'all' },
  { label: 'NGワードコメント', name: 'ng_word' },
  { label: '報告されたコメント', name: 'reported' },
]
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
