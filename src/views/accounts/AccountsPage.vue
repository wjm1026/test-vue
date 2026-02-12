<template>
  <LayoutMain
    title="アカウント管理"
    :total="accountList?.total"
    :show-pagination="true"
    :page="page"
    @page-change="pageChange"
    :show-back-button="false"
  >
    <div class="flex flex-col gap-8 h-full">
      <AddButton label="追加する" @click="accountAdd" />
      <div class="flex flex-col gap-6 flex-1 min-h-0">
        <SearchInput placeholder="氏名、メールアドレスで検索" v-model="searchKeyword" />
        <div class="flex flex-col gap-3 flex-1 min-h-0">
          <div class="flex flex-col gap-3 flex-1 overflow-auto">
            <ElText class="self-start text-xs font-bold text-gray800">
              全{{ accountList?.total ?? 0 }}人
            </ElText>
            <AccountsTable
              class="h-full"
              :data="accountList?.accounts"
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
import { useAccountsPage } from './useAccountsPage.ts'

import AddButton from '@/components/button/AddButton.vue'
import SearchInput from '@/components/input/SearchInput.vue'
import LayoutMain from '@/components/layout/LayoutMain.vue'
import AccountsTable from '@/components/view/accounts/AccountsTable.vue'

const {
  accountList,
  page,
  searchKeyword,
  sortField,
  sortOrder,
  isLoading,
  pageChange,
  accountAdd,
} = useAccountsPage()
</script>
