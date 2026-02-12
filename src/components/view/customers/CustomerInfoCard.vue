<template>
  <div
    class="flex flex-wrap gap-3 p-6 border border-gray400 rounded-xl self-start w-full"
    v-loading="isLoading"
  >
    <div class="flex flex-col flex-1 gap-2 min-w-[180px]">
      <div class="flex flex-row gap-1.5">
        <ElText class="text-gray700 text-[11px] w-[120px]">顧客ID</ElText>
        <ElText class="text-gray800 text-[11px]">
          {{ customer.userId }}
        </ElText>
      </div>
      <div class="flex flex-row gap-1.5">
        <ElText class="text-gray700 text-[11px] w-[120px]">ニックネーム</ElText>
        <ElText class="text-gray800 text-[11px]">
          {{ customer.nickname }}
        </ElText>
      </div>
    </div>
    <div class="flex flex-col flex-1 gap-2 min-w-[180px]">
      <div class="flex flex-row gap-1.5">
        <ElText class="text-gray700 text-[11px] w-[120px]">年齢層</ElText>
        <ElText class="text-gray800 text-[11px]">
          {{ customer.ageGroup }}
        </ElText>
      </div>
      <div class="flex flex-row gap-1.5">
        <ElText class="text-gray700 text-[11px] w-[120px]">性別</ElText>
        <ElText class="text-gray800 text-[11px]">
          {{ customer.gender }}
        </ElText>
      </div>
    </div>
    <div class="flex flex-col flex-1 gap-2 min-w-[180px]">
      <div class="flex flex-row gap-1.5">
        <ElText class="text-gray700 text-[11px] w-[120px]">商品レビュー数</ElText>
        <ElText class="text-gray800 text-[11px]"> {{ customer.totalReviews }}回 </ElText>
      </div>
      <div class="flex flex-row gap-1.5">
        <ElText class="text-gray700 text-[11px] w-[120px]">参考になった獲得回数</ElText>
        <ElText class="text-gray800 text-[11px]">
          {{ formatNumber(customer.totalLikes) }}回
        </ElText>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomerDetail } from '@/api/types/customers'
import { formatNumberWithCommas } from '@/util/form-data-helper'

interface Props {
  customer: CustomerDetail
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const formatNumber = (num: number) => {
  return formatNumberWithCommas(num)
}
</script>
