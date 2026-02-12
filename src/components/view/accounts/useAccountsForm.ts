import type { FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { AccountCreatedData } from './useCreateAccountDialog'

import type { AccountForm, AccountDetail } from '@/api/types/accounts'
import { useAccountApi } from '@/hooks/useAccountApi'
import { useAccountRoleListApi } from '@/hooks/useAccountRoleListApi'
import { routePaths } from '@/router/paths'
import message from '@/enum/message.json'
import { pattern } from '@/enum'

export interface AccountFormEmit {
  (e: 'successAccountSubmit', createdAccount: AccountCreatedData): void
}
export interface AccountFormProps {
  accountDetail?: AccountDetail
}

export const useAccountsForm = (emit: AccountFormEmit, props: AccountFormProps) => {
  const router = useRouter()
  const route = useRoute()

  const accountId = computed(() => Number(route.params.id) ?? undefined)
  const isEdit = computed(() => !!accountId.value)

  const accountFormRef = ref<FormInstance>()
  const initialAccountForm: AccountForm = {
    accountId: accountId.value,
    password: '',
    accountName: '',
    email: '',
    roleId: undefined,
  }
  const accountForm = reactive<AccountForm>({ ...initialAccountForm })
  const accountFormRules = computed<FormRules<AccountForm>>(() => {
    const baseRules: FormRules<AccountForm> = {
      accountName: [
        { required: true, message: message.account.accountNameRequired, trigger: 'blur' },
      ],
      email: [
        { required: true, message: message.login.emailRequired, trigger: 'blur' },
        {
          pattern: pattern.email,
          message: message.login.emailInvalid,
          trigger: ['blur', 'change'],
        },
      ],
      roleId: [{ required: true, message: message.account.roleRequired, trigger: 'blur' }],
    }

    if (isEdit.value) {
      baseRules.password = [
        { required: true, message: message.login.passwordRequired, trigger: 'blur' },
        {
          pattern: pattern.password,
          message: message.login.passwordPattern,
          trigger: ['blur', 'change'],
        },
      ]
    }

    return baseRules
  })

  const { accountRoleList } = useAccountRoleListApi()

  const resetForm = () => {
    Object.assign(accountForm, {
      ...initialAccountForm,
      accountId: undefined,
      roleId: undefined,
      password: '',
    })
  }

  const fillFormFromDetail = () => {
    const data = props.accountDetail
    if (!data) return

    Object.assign(accountForm, {
      accountId: data.accountId,
      accountName: data.accountName,
      email: data.email,
      roleId: data.roleId,
      password: data.password,
    })
  }

  watch(
    () => [isEdit.value, props.accountDetail, accountRoleList.value],
    () => {
      if (!isEdit.value) {
        resetForm()
        return
      }

      if (accountRoleList.value?.roles && props.accountDetail) {
        fillFormFromDetail()
      }
    },
    { immediate: true },
  )

  const submitLabel = computed(() => (isEdit.value ? '決定する' : '登録する'))

  const isEmailValid = computed(() => pattern.email.test(accountForm.email))

  const disabled = computed(() => {
    if (isEdit.value) {
      return !(accountForm.accountName && isEmailValid.value && accountForm.roleId)
    }
    return !(accountForm.accountName && isEmailValid.value && accountForm.roleId)
  })

  const { submitAccount, isPending: isSubmitPending } = useAccountApi()
  const handleSubmit = async () => {
    if (!accountFormRef.value) return
    await accountFormRef.value.validate()

    const data: AccountForm = {
      ...(isEdit.value && { accountId: accountForm.accountId }),
      accountName: accountForm.accountName.trim(),
      email: accountForm.email.trim(),
      roleId: accountForm.roleId,
    }

    await submitAccount(data)
    const roleName =
      accountRoleList.value?.roles.find((role) => role.roleId === accountForm.roleId)
        ?.roleDisplayName ?? ''
    emit('successAccountSubmit', {
      accountName: data.accountName,
      email: data.email,
      roleDisplayName: roleName,
    })
  }

  const handleCancel = () => {
    router.push(routePaths.accounts.root)
  }

  return {
    accountFormRef,
    accountForm,
    accountFormRules,
    submitLabel,
    handleCancel,
    handleSubmit,
    isSubmitPending,
    disabled,
    accountRoleList,
    isEdit,
  }
}
