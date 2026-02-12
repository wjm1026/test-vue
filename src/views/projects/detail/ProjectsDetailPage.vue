<template>
  <LayoutMain :title="title" :show-empty="isEmpty && !isLoading">
    <div class="flex flex-col gap-8 pb-8" v-loading="isLoading">
      <div>
        <AddButton v-if="projects.reportId" label="レポートを見る" @click="reportHandle" />
      </div>
      <div class="flex flex-col">
        <div class="text-gray500 border-gray400 mb-[20px] border-b text-[11px]/[24px]">
          調査条件
        </div>
        <div class="flex flex-col mb-[14px]">
          <ElText class="text-gray700 self-start text-[11px]">調査期間</ElText>
          <ElText class="text-gray800 self-start text-[14px] font-medium">
            {{ formatDate(projects.startDate) }} {{ formatDateRangeEnd(projects.endDate) }}
          </ElText>
        </div>
        <div class="flex flex-col mb-[32px]">
          <p class="flex text-gray700 items-center text-[11px]">
            <span class="w-[130px]">対象商品の購入期間：</span>
            <span class="text-gray800 self-start font-medium">
              {{ formatDate(projects.purchaseStartDate) }}
              {{ formatDateRangeEnd(projects.purchaseEndDate) }}
            </span>
          </p>
          <p class="flex text-gray700 items-center text-[11px]">
            <span class="w-[130px]">プロジェクト公開期間：</span>
            <span class="text-gray800 self-start font-medium">
              {{ formatDate(projects.startDate) }} {{ formatDateRangeEnd(projects.publishEndDate) }}
            </span>
          </p>
        </div>
        <div class="flex flex-col mb-[32px]">
          <ElText class="text-gray700 self-start text-[11px] mb-[6px]">対象商品</ElText>
          <div class="border-gray300 rounded-sm border p-[20px]">
            <ProductsTable
              :data="targetProductData"
              :isSort="false"
              :isDetail="false"
              height="200px"
              v-model:sortField="sortField"
              v-model:sortOrder="sortOrder"
            />
          </div>
        </div>
        <div class="flex flex-col mb-[32px]">
          <ElText class="text-gray700 self-start text-[11px]">付与ポイント</ElText>
          <ElText class="text-gray800 self-start text-[14px] font-medium">
            {{ projects.point }}pt
          </ElText>
        </div>
        <div class="flex flex-col mb-2">
          <ElText class="text-gray700 self-start text-[11px]">商品の優先表示</ElText>
          <ElText class="text-gray800 self-start text-[14px] font-medium">
            {{ projects.priority ? projects.priority : '-' }}
          </ElText>
        </div>
      </div>
      <div class="mb-1">
        <WhiteButton
          label="編集する"
          class="mr-[12px] ml-0 h-[40px] w-[120px]"
          :disabled="!canEditProject"
          @click="updateHandle"
        />
        <WithDeleteConfirm
          @confirm="deleteHandle"
          title="プロジェクトを削除します"
          :loading="isDeleteLoading"
        >
          <template #content>
            <div
              class="border-gray300 flex h-[48px] min-w-[320px] items-center rounded-sm border pt-2 pr-3 pb-2 pl-3"
            >
              <BaseImage class="h-8 w-8 rounded-sm" :src="targetProductData[0]?.productImageUrl" />
              <div class="ml-3 flex flex-col">
                <ElText class="text-gray800 self-start text-[12px] leading-[14px]">
                  {{ projects.name }}
                </ElText>
                <ElText class="text-gray500 self-start text-[10px] leading-[12px] font-medium">
                  {{ projects.startDate }}{{ formatDateRangeEnd(projects.endDate) }}
                </ElText>
              </div>
            </div>
          </template>
          <WhiteButton
            label="削除する"
            class="ml-0 h-[40px] w-[120px]"
            className="border-error text-error hover:bg-error-bg"
            :disabled="!canDeleteProject"
          />
        </WithDeleteConfirm>
      </div>
    </div>
  </LayoutMain>
</template>
<script lang="ts" setup>
import { useProjectsDetailPage } from './useProjectsDetailPage'

import { formatDate, formatDateRangeEnd } from '@/util/date-format'

const {
  title,
  projects,
  isLoading,
  isEmpty,
  targetProductData,
  sortField,
  sortOrder,
  isDeleteLoading,
  canEditProject,
  canDeleteProject,
  reportHandle,
  updateHandle,
  deleteHandle,
} = useProjectsDetailPage()
</script>
