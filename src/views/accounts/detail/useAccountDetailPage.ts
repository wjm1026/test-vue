import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useAccountDetailApi } from '@/hooks/useAccountDetailApi'
import { useAccountDeleteApi } from '@/hooks/useAccountDeleteApi'
import { useAccountStatusApi } from '@/hooks/useAccountStatusApi'
import { AccountStatusCode } from '@/enum/constants'
import type { AccountStatus } from '@/api/types/accounts'
import { routeNames, routePaths } from '@/router/routes'
import message from '@/enum/message.json'
import { ResultCodeEnum } from '@/enum'

export const useAccountDetailPage = () => {
  const route = useRoute()
  const router = useRouter()
  const accountId = computed(() => Number(route.params.id) ?? 0)

  const { accountDetail, isLoading } = useAccountDetailApi(accountId)
  const { deleteAccountMutateAsync, isDeleteLoading } = useAccountDeleteApi()

  const isEmpty = computed(() => {
    return !isLoading.value && !accountDetail.value
  })

  const accountStatusActionLabel = computed(() => {
    return accountDetail.value?.statusCode === AccountStatusCode.Active
      ? '利用停止する'
      : '利用再開する'
  })

  const confirmTitle = computed(() => {
    return accountDetail.value?.statusCode === AccountStatusCode.Active
      ? '利用停止します'
      : '利用再開します'
  })

  const accountInfo = computed(() => {
    if (!accountDetail.value) return []
    const data = accountDetail.value
    return [
      { label: '氏名', value: data.accountName },
      { label: 'メールアドレス', value: data.email },
      { label: 'ロール', value: data.roleDisplayName },
      { label: 'ステータス', value: data.statusDisplayName },
    ]
  })

  const handleEdit = () => {
    router.push({
      name: routeNames.accounts.create,
      params: { id: accountId.value },
    })
  }

  const { updateAccountStatus, isStatusLoading } = useAccountStatusApi()

  const handleUpdateAccountStatus = async () => {
    if (!accountId.value) return

    const targetStatus =
      accountDetail.value?.statusCode === AccountStatusCode.Active
        ? AccountStatusCode.Inactive
        : AccountStatusCode.Active

    const data: AccountStatus = {
      accountId: accountId.value,
      statusCode: targetStatus,
    }

    const {
      accountId: updatedAccountId,
      statusCode,
      statusDisplayName,
    } = await updateAccountStatus(data)
    if (updatedAccountId === accountDetail.value?.accountId) {
      accountDetail.value.statusCode = statusCode
      accountDetail.value.statusDisplayName = statusDisplayName
    }
    ElMessage.success(message.account.updateStatusSuccess)
    router.push(routePaths.accounts.root)
  }

  const handleDelete = async () => {
    if (!accountId.value) return

    const response = await deleteAccountMutateAsync(Number(accountId.value))
    if (response.resultCode === ResultCodeEnum.Success) {
      ElMessage.success(message.account.deleteSuccess)
      router.push(routePaths.accounts.root)
    }
  }

  return {
    accountDetail,
    isLoading,
    isStatusLoading,
    accountStatusActionLabel,
    confirmTitle,
    isEmpty,
    accountInfo,
    handleEdit,
    handleUpdateAccountStatus,
    handleDelete,
    isDeleteLoading,
  }
}
