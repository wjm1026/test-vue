import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { routePaths } from '@/router/paths'

export interface AccountCreatedData {
  accountName: string
  email: string
  roleDisplayName: string
}
export interface AccountCreatedDataProps {
  modelValue: boolean
  account: AccountCreatedData
}

export const useCreateAccountDialog = (
  props: AccountCreatedDataProps,
  emit: (event: 'closeDialog') => void,
) => {
  const router = useRouter()

  const accountVisible = computed({
    get: () => props.modelValue,
    set: (val) => {
      if (!val) {
        emit('closeDialog')
        router.push(routePaths.accounts.root)
      }
    },
  })

  const closeAccountDialog = () => {
    accountVisible.value = false
  }

  return {
    accountVisible,
    closeAccountDialog,
  }
}
