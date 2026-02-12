<template>
  <LayoutMain :show-empty="isEmpty && !isLoading">
    <div class="flex flex-col pb-8 h-full" v-loading="isLoading">
      <div class="flex items-center gap-3 mb-8">
        <SuccessIcon v-if="accountDetail?.statusCode === AccountStatusCode.Active" :size="20" />
        <ErrorIcon
          v-else-if="accountDetail?.statusCode === AccountStatusCode.Inactive"
          :size="20"
        />
        <PendingIcon
          v-else-if="accountDetail?.statusCode === AccountStatusCode.Pending"
          :size="20"
        />
        <ElText class="text-2xl font-bold text-gray800">
          {{ accountDetail?.accountName }}
        </ElText>
      </div>

      <div class="text-gray500 border-gray400 mb-[20px] border-b text-[11px]/[24px]">基本情報</div>
      <div class="flex flex-col pb-[24px]" v-for="item in accountInfo" :key="item.label">
        <ElText class="text-gray700 self-start text-[11px]">{{ item.label }}</ElText>
        <ElText
          class="text-gray800 self-start text-[14px] font-medium break-words whitespace-normal max-w-[40ch]"
        >
          {{ item.value }}
        </ElText>
      </div>

      <div v-if="!isLoading" class="mt-4">
        <WhiteButton label="編集する" class="h-10 w-[120px] ml-0 mr-[12px]" @click="handleEdit" />
        <WithDeleteConfirm
          :title="confirmTitle"
          :confirmLabel="accountStatusActionLabel"
          :loading="isStatusLoading"
          @confirm="handleUpdateAccountStatus"
        >
          <template #content>
            <div
              class="border-gray300 flex w-fit min-w-[320px] items-center rounded-sm border pt-2 pr-3 pb-2 pl-3"
            >
              <div class="ml-3 flex flex-col">
                <ElText class="text-gray800 self-start text-[12px] leading-[14px]">
                  {{ accountDetail?.accountName }}
                </ElText>
                <ElText
                  class="text-gray500 self-start text-[10px] leading-[12px] font-medium break-words whitespace-normal max-w-[40ch]"
                >
                  {{ accountDetail?.email }} / {{ accountDetail?.roleDisplayName }}
                </ElText>
              </div>
            </div>
          </template>
          <WhiteButton
            v-if="accountDetail && accountDetail.statusCode !== AccountStatusCode.Pending"
            :label="accountStatusActionLabel"
            className="h-10 w-[120px] ml-0 mr-[12px] border-error text-error hover:bg-error-bg"
          />
        </WithDeleteConfirm>

        <WithDeleteConfirm
          title="アカウントを削除します"
          :loading="isDeleteLoading"
          @confirm="handleDelete"
        >
          <template #content>
            <div
              class="border-gray300 flex h-fit min-w-[320px] items-center rounded-sm border pt-2 pr-3 pb-2 pl-3"
            >
              <div class="ml-3 flex flex-col">
                <ElText class="text-gray800 self-start text-[12px] leading-[14px]">
                  {{ accountDetail?.accountName }}
                </ElText>
                <ElText
                  class="text-gray500 self-start text-[10px] leading-[12px] font-medium break-words whitespace-normal max-w-[40ch]"
                >
                  {{ accountDetail?.email }} / {{ accountDetail?.roleDisplayName }}
                </ElText>
              </div>
            </div>
          </template>
          <WhiteButton
            label="削除する"
            class="h-10 w-[120px] ml-0"
            className="bg-error text-white border-error hover:bg-error"
          />
        </WithDeleteConfirm>
      </div>
    </div>
  </LayoutMain>
</template>

<script setup lang="ts">
import { useAccountDetailPage } from './useAccountDetailPage'

import { AccountStatusCode } from '@/enum/constants'
import WhiteButton from '@/components/button/WhiteButton.vue'
import LayoutMain from '@/components/layout/LayoutMain.vue'
import SuccessIcon from '@/components/icon/SuccessIcon.vue'
import ErrorIcon from '@/components/icon/ErrorIcon.vue'
import PendingIcon from '@/components/icon/PendingIcon.vue'
import WithDeleteConfirm from '@/components/dialog/WithDeleteConfirm.vue'

const {
  accountDetail,
  isLoading,
  isEmpty,
  accountInfo,
  accountStatusActionLabel,
  confirmTitle,
  isStatusLoading,
  handleEdit,
  handleUpdateAccountStatus,
  handleDelete,
  isDeleteLoading,
} = useAccountDetailPage()
</script>

<style scoped>
@reference '@/style/tailwindcss.css';
</style>
