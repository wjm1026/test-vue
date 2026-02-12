<template>
  <div class="flex flex-col gap-8">
    <ElText class="text-gray800 text-2xl font-bold">パスワードの再設定</ElText>
    <ElText class="text-gray800 self-start"> 新しいパスワードを入力してください。 </ElText>
  </div>
  <ElForm
    ref="resetPasswordFormRef"
    :model="resetPasswordForm"
    label-position="top"
    class="w-[482px] text-gray800"
    :rules="resetPasswordFormRules"
    hide-required-asterisk
  >
    <ElFormItem label="新しいパスワード" prop="password">
      <ElInput
        v-model="resetPasswordForm.password"
        maxlength="64"
        type="password"
        class="text-xs"
      />
      <ElText class="text-gray800 text-[10px] leading-1 mt-2 mb-1">
        ※半角英大文字、半角英小文字、数字、記号（! @ # $ % ^ & * ( ) _ + -
        =）を必ず１文字使用してください
      </ElText>
    </ElFormItem>

    <ElFormItem label="新しいパスワード（確認用）" prop="confirmPassword" class="mt-10">
      <ElInput
        v-model="resetPasswordForm.confirmPassword"
        maxlength="64"
        class="text-xs"
        type="password"
      />
    </ElFormItem>
  </ElForm>
  <div class="flex justify-center">
    <BlueButton
      label="パスワードを設定する"
      class="w-[200px] h-[48px]"
      @click="resetPasswordFormSubmit"
      :disabled="disabled"
      :loading="isPending"
    />
  </div>
</template>

<script setup lang="ts">
import { useResetPasswordForm } from './useResetPasswordForm'

const emit = defineEmits<{ (event: 'resetPasswordSubmitSuccess'): void }>()

const {
  disabled,
  resetPasswordForm,
  resetPasswordFormRef,
  resetPasswordFormRules,
  resetPasswordFormSubmit,
  isPending,
} = useResetPasswordForm(emit)
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-form-item__label) {
  @apply text-gray800  font-bold;
}
</style>
