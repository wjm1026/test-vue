<template>
  <ElForm
    ref="loginFormRef"
    :model="loginForm"
    label-position="top"
    class="w-[480px] text-gray800"
    :rules="loginFormRules"
    hide-required-asterisk
    @submit.prevent="loginFormSubmit"
  >
    <ElFormItem label="メールアドレス" prop="email">
      <ElInput v-model="loginForm.email" placeholder="sample@example.com" class="text-xs" />
    </ElFormItem>
    <ElFormItem label="パスワード" prop="password">
      <ElInput
        v-model="loginForm.password"
        type="password"
        maxlength="64"
        placeholder="半角英数字20文字以内"
        class="text-xs"
      />
    </ElFormItem>
    <div class="flex justify-end">
      <ElText
        class="text-primary500 underline underline-offset-1 font-bold cursor-pointer"
        @click="forgetPasswordHandle"
      >
        パスワードをお忘れの場合はこちら
      </ElText>
    </div>
    <ElFormItem>
      <div class="w-full text-center mt-16">
        <BlueButton
          label="ログインする"
          class="w-[200px] h-12"
          native-type="submit"
          :disabled="disabled"
          :loading="isPending"
        />
      </div>
    </ElFormItem>
  </ElForm>
</template>

<script setup lang="ts">
import { useLoginForm } from '@/components/view/login/useLoginForm'

const {
  disabled,
  loginForm,
  loginFormRef,
  loginFormRules,
  forgetPasswordHandle,
  loginFormSubmit,
  isPending,
} = useLoginForm()
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-form-item__label) {
  @apply text-gray800 font-bold;
}
</style>
