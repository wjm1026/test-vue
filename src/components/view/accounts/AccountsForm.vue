<template>
  <BaseForm
    ref="accountFormRef"
    :model="accountForm"
    :rules="accountFormRules"
    label-position="top"
  >
    <ElFormItem label="氏名" prop="accountName">
      <ElInput v-model="accountForm.accountName" maxlength="50" placeholder="氏名を入力" />
    </ElFormItem>

    <ElFormItem v-if="!props.accountDetail?.accountId" label="メールアドレス" prop="email">
      <ElInput v-model="accountForm.email" placeholder="sample@example.com" />
    </ElFormItem>

    <ElFormItem label="ロール" prop="roleId">
      <el-select-v2
        v-model="accountForm.roleId"
        popper-class="category-popper"
        :options="filteredAccountRoleList"
        :props="{
          label: 'roleDisplayName',
          value: 'roleId',
        }"
        placeholder="選択してください"
      />
    </ElFormItem>

    <ElFormItem>
      <WhiteButton label="キャンセル" class="w-[120px] h-10" @click="router.go(-1)" />
      <BlueButton
        :label="submitLabel"
        class="w-[120px] h-10"
        :isLoading="isSubmitPending"
        :disabled="disabled"
        @click="handleSubmit"
      />
    </ElFormItem>
  </BaseForm>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'

import { useAccountsForm, type AccountFormEmit, type AccountFormProps } from './useAccountsForm'

import BaseForm from '@/components/form/BaseForm.vue'
import WhiteButton from '@/components/button/WhiteButton.vue'
import BlueButton from '@/components/button/BlueButton.vue'
import { AccountRoleDisplayName } from '@/enum'

const router = useRouter()
const emit = defineEmits<AccountFormEmit>()
const props = defineProps<AccountFormProps>()

const {
  accountFormRef,
  accountForm,
  accountFormRules,
  submitLabel,
  handleSubmit,
  isSubmitPending,
  disabled,
  accountRoleList,
} = useAccountsForm(emit, props)

const filteredAccountRoleList = computed(
  () =>
    accountRoleList.value?.roles.filter(
      ({ roleDisplayName }) => roleDisplayName !== AccountRoleDisplayName.RepresentativeAdmin,
    ) ?? [],
)
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-form-item) {
  @apply w-[480px] mb-6;
}
:deep(.el-form-item:nth-last-child(2)) {
  @apply mb-10;
}
</style>
