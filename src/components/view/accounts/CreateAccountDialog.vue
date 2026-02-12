<template>
  <BaseDialog
    v-model="accountVisible"
    dialogTitle="アカウントが作成されました"
    @close="closeAccountDialog"
  >
    <template #main>
      <div
        class="border-gray300 flex min-h-[48px] min-w-[320px] items-center rounded-sm border pt-2 pr-3 pb-2 pl-3"
      >
        <div class="ml-3 flex flex-col">
          <ElText class="text-gray800 self-start text-[12px] leading-[14px]">
            {{ account.accountName }}
          </ElText>
          <ElText class="text-gray500 self-start text-[10px] leading-[12px] font-medium">
            <span v-if="!route.params.id"> {{ account.email }} / </span>
            {{ account.roleDisplayName }}
          </ElText>
        </div>
      </div>
      <BlueButton label="閉じる" class="mt-10 h-10 w-[200px]" @click="closeAccountDialog" />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useCreateAccountDialog } from './useCreateAccountDialog'
import type { AccountCreatedDataProps } from './useCreateAccountDialog'

import BlueButton from '@/components/button/BlueButton.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'

const props = defineProps<AccountCreatedDataProps>()
const route = useRoute()

const emit = defineEmits(['closeDialog'])

const { accountVisible, closeAccountDialog } = useCreateAccountDialog(props, emit)
</script>
