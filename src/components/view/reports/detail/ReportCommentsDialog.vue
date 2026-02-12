<template>
  <BaseDialog v-model="commentVisible" :width="800" className="h-[672px]" @close="handleClose">
    <template #title>
      <div class="text-gray800 mb-8 space-x-2">
        <span class="text-xl font-medium">評価コメント</span>
        <span class="text-base font-bold">全{{ commentList?.totalCount ?? 0 }}件</span>
      </div>
    </template>
    <template #main>
      <div class="w-full h-full flex flex-col gap-8" v-loading="isLoading">
        <SearchInput v-model="searchKeyword" placeholder="キーワードで絞り込み" />
        <div class="space-y-1.5">
          <span class="text-gray800 text-xs font-bold">絞り込み</span>
          <div class="h-6">
            <ElRadioGroup v-model="rating">
              <BaseRadio label="よかった" :value="CommentRating.Good" />
              <BaseRadio label="イマイチ" :value="CommentRating.Bad" />
              <BaseRadio label="全て" :value="All" />
            </ElRadioGroup>
          </div>
        </div>
        <div class="flex-1">
          <div class="grid grid-cols-2 gap-3">
            <ReviewCard
              v-for="item in commentList?.comments"
              :key="item.reviewId ?? item.label"
              v-bind="item"
            />
          </div>
          <ElEmpty
            v-if="!isLoading && commentList?.comments?.length === 0"
            description="データがありません"
          />
        </div>
        <div class="flex justify-end">
          <ElPagination
            layout="prev, pager, next"
            :total="commentList?.totalCount ?? 0"
            :current-page="page"
            :page-size="limit"
            @current-change="pageChange"
          />
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { All, useReportCommentsDialog } from './useReportCommentsDialog'

import { CommentRating } from '@/enum'

const props = defineProps<{
  modelValue: boolean
  rating?: CommentRating
  projectId?: number
}>()

const emit = defineEmits(['closeComments'])
const {
  commentVisible,
  searchKeyword,
  rating,
  commentList,
  isLoading,
  page,
  limit,
  pageChange,
  handleClose,
} = useReportCommentsDialog(props, emit)
</script>
