<template>
  <div class="flex flex-col gap-8">
    <ElText class="text-gray800 text-2xl font-bold">パスワードをお忘れの場合</ElText>
    <ElText class="text-gray800">
      メールアドレスを入力してください。ご入力いただいたメールアドレス宛にパスワードの再設定メールのお送りします。
    </ElText>
  </div>
  <ElForm
    ref="forgetPasswordFormRef"
    :model="forgetPasswordForm"
    label-position="top"
    class="w-[480px] text-gray800"
    :rules="forgetPasswordFormRules"
    hide-required-asterisk
  >
    <ElFormItem label="メールアドレス" prop="email">
      <ElInput
        v-model="forgetPasswordForm.email"
        maxlength="64"
        placeholder="sample@example.com"
        class="text-xs"
      />
    </ElFormItem>
  </ElForm>
  <div class="flex flex-col gap-2 items-center">
    <BlueButton
      label="送信する"
      class="w-[200px] h-[48px]"
      @click="forgetPasswordFormSubmit"
      :disabled="disabled"
      :loading="isPending"
    />
    <ElButton text class="w-[200px] h-[48px] text-primary600 ml-0 font-bold" @click="goBack">
      戻る
    </ElButton>
  </div>
</template>

<script setup lang="ts">
import { useForgetPasswordForm } from './useForgetPasswordForm'

const props = defineProps<{
  initialEmail?: string
}>()

const emit = defineEmits<{ (event: 'emailSubmitSuccess', email: string): void }>()

const {
  disabled,
  forgetPasswordForm,
  forgetPasswordFormRef,
  forgetPasswordFormRules,
  forgetPasswordFormSubmit,
  goBack,
  isPending,
} = useForgetPasswordForm(emit, props.initialEmail)
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-form-item__label) {
  @apply text-gray800  font-bold;
}
</style>
