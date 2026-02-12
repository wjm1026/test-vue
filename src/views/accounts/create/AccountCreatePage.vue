<template>
  <LayoutMain :title="pageTitle">
    <div class="flex flex-col h-full" v-loading="isLoading">
      <div class="text-gray500 border-gray400 mb-[20px] border-b text-[11px]/[24px]">基本情報</div>
      <AccountsForm
        v-if="!isLoading"
        :accountDetail="accountDetail"
        @successAccountSubmit="handleSubmit"
        :isLoading="isLoading"
      />
    </div>
    <CreateAccountDialog v-model="createVisible" :account="createdAccount" />
  </LayoutMain>
</template>

<script setup lang="ts">
import { useAccountCreatePage } from './useAccountCreatePage'

import LayoutMain from '@/components/layout/LayoutMain.vue'
import AccountsForm from '@/components/view/accounts/AccountsForm.vue'
import CreateAccountDialog from '@/components/view/accounts/CreateAccountDialog.vue'

const { pageTitle, accountDetail, createVisible, createdAccount, handleSubmit, isLoading } =
  useAccountCreatePage()
</script>
