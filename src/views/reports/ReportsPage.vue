<template>
  <LayoutMain
    title="調査レポート"
    :total="reportList?.total"
    :show-pagination="true"
    @page-change="pageChange"
    :show-back-button="false"
  >
    <div class="h-full flex flex-col gap-6">
      <SearchInput placeholder="プロジェクト名、商品名で絞り込み" v-model="searchKeyword" />
      <div class="flex flex-col">
        <p class="text-[12px] font-bold mb-[6px]">絞り込み</p>
        <div class="flex items-center">
          <ElText class="text-[11px] font-medium mr-2">実施期間：</ElText>
          <BaseDatePicker
            v-model="startDate"
            placeholder="開始日"
            :disabled-date="disableStartDate"
            :clearable="true"
          ></BaseDatePicker>
          <ElText class="text-gray700 pr-[4px] pl-[4px] text-[11px]">～</ElText>
          <BaseDatePicker
            v-model="endDate"
            placeholder="終了日"
            :disabled-date="disableEndDate"
            :clearable="true"
          ></BaseDatePicker>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-3 overflow-auto">
        <ElText class="text-gray800 self-start text-xs font-bold">
          全{{ reportList?.total }}レポート
        </ElText>
        <ReportsTable
          class="h-full"
          :isLoading="isLoading"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
          :data="reportList?.reports"
        />
      </div>
    </div>
  </LayoutMain>
</template>
<script setup lang="ts">
import { useReportsPage } from './useReportsPage'

const {
  searchKeyword,
  startDate,
  endDate,
  sortField,
  sortOrder,
  reportList,
  isLoading,
  pageChange,
  disableStartDate,
  disableEndDate,
} = useReportsPage()
</script>
