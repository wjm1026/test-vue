<template>
  <ElTable
    size="small"
    stripe
    :data="data ?? []"
    :height="height"
    v-loading="isLoading"
    empty-text="アカウントがありません"
    header-cell-class-name="bg-primary100 text-[10px] text-gray700"
    cell-class-name="h-14 text-[11px] text-gray800"
    class="w-full"
  >
    <ElTableColumn minWidth="36">
      <template #default="{ row }">
        <div class="flex items-center justify-center">
          <SuccessIcon v-if="row.statusCode === AccountStatusCode.Active" :size="12" />
          <ErrorIcon v-else-if="row.statusCode === AccountStatusCode.Inactive" :size="12" />
          <PendingIcon v-else-if="row.statusCode === AccountStatusCode.Pending" :size="12" />
        </div>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="accountName" minWidth="160">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="氏名"
          field="accountName"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>氏名</p>
      </template>
      <template #default="{ row }">
        <ElText :class="getAccountClassName(row)" @click="handleAccountClick(row)">
          {{ row.accountName }}
        </ElText>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="email" minWidth="200">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="メールアドレス"
          field="email"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>メールアドレス</p>
      </template>
      <template #default="{ row }">
        <ElText class="text-gray800 text-[11px] ellipsis-cell">
          {{ row.email }}
        </ElText>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="roleDisplayName" minWidth="72">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="ロール"
          field="roleDisplayName"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>ロール</p>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="statusDisplayName" minWidth="96">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="ステータス"
          field="statusDisplayName"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>ステータス</p>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="lastLogin" minWidth="144">
      <template #header>
        <SortHeader
          v-if="isSort"
          label="最終ログイン日"
          field="lastLogin"
          v-model:sortField="sortField"
          v-model:sortOrder="sortOrder"
        />
        <p v-else>最終ログイン日</p>
      </template>
      <template #default="{ row: { lastLogin } }">
        <span v-if="lastLogin">{{ formatDate(lastLogin, DATE_TIME_FORMAT) }}</span>
        <span v-else>-</span>
      </template>
    </ElTableColumn>
    <ElTableColumn minWidth="72">
      <template #default="{ row }">
        <WhiteButton
          v-if="!isRepresentativeAdmin(row)"
          label="編集"
          className="w-12 h-6 text-[11px]"
          @click="handleEditClick(row.accountId)"
        />
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import type { SortOrder } from '@/enum'
import type { Account } from '@/api/types/accounts'
import { AccountStatusCode, DATE_TIME_FORMAT, AccountRoleDisplayName } from '@/enum/constants'
import SortHeader from '@/components/table/SortHeader.vue'
import WhiteButton from '@/components/button/WhiteButton.vue'
import SuccessIcon from '@/components/icon/SuccessIcon.vue'
import ErrorIcon from '@/components/icon/ErrorIcon.vue'
import PendingIcon from '@/components/icon/PendingIcon.vue'
import { formatDate } from '@/util/date-format'
import { routeNames } from '@/router/routes'

const router = useRouter()

const isRepresentativeAdmin = (row: Account) =>
  row.roleDisplayName === AccountRoleDisplayName.RepresentativeAdmin

withDefaults(
  defineProps<{
    data?: Account[]
    isSort?: boolean
    height?: string
    isLoading?: boolean
  }>(),
  {
    isSort: true,
    height: 'auto',
    isLoading: false,
  },
)

const sortField = defineModel<string>('sortField')
const sortOrder = defineModel<SortOrder>('sortOrder')

const getAccountClassName = (row: Account) => {
  const commonClassName = 'text-[11px] ellipsis-cell'
  const clickableClassName = 'text-primary600 cursor-pointer underline underline-offset-2'
  return `${commonClassName} ${isRepresentativeAdmin(row) ? 'text-gray800' : clickableClassName}`
}

const handleAccountClick = (row: Account) => {
  if (isRepresentativeAdmin(row)) return

  router.push({
    name: routeNames.accounts.detail,
    params: { id: String(row.accountId) },
  })
}

const handleEditClick = (accountId: number) => {
  router.push({
    name: routeNames.accounts.create,
    params: { id: String(accountId) },
  })
}
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

.accounts-table {
  @apply h-full w-full;
}

:deep(.el-table) {
  @apply w-full;
  table-layout: fixed;
}

:deep(.el-table__header-wrapper),
:deep(.el-table__body-wrapper) {
  @apply w-full;
}

.ellipsis-cell {
  @apply truncate block;
}
:deep(.el-table__body-wrapper) {
  @apply flex-1 overflow-auto;
}

:deep(.el-table__row--striped > .el-table__cell) {
  @apply !bg-primary;
}
</style>
