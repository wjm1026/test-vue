import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useAccountDetailApi } from '@/hooks/useAccountDetailApi'
import type { AccountCreatedData } from '@/components/view/accounts/useCreateAccountDialog'

export const useAccountCreatePage = () => {
  const route = useRoute()

  const accountId = computed(() => Number(route.params.id) ?? 0)
  const isEdit = computed(() => !!accountId.value)

  const { accountDetail, isLoading } = useAccountDetailApi(accountId)

  const pageTitle = computed(() =>
    isEdit.value ? accountDetail.value?.accountName : 'アカウント追加',
  )

  const createVisible = ref(false)
  const createdAccount = reactive<AccountCreatedData>({
    accountName: '',
    email: '',
    roleDisplayName: '',
  })

  const handleSubmit = (data: AccountCreatedData) => {
    Object.assign(createdAccount, data)
    createVisible.value = true
  }

  return {
    pageTitle,
    isLoading,
    accountDetail,
    createVisible,
    createdAccount,
    handleSubmit,
  }
}
