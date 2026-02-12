<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <div class="flex flex-col w-[480px] gap-[64px]">
      <ForgetPasswordForm
        v-if="activeStep === 0"
        :initialEmail="savedEmail"
        @emailSubmitSuccess="emailSubmitSuccess"
      />
      <ForgetPasswordNotice v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useForgetPasswordPage } from './useForgetPasswordPage'

const { activeStep, emailSubmitSuccess, savedEmail } = useForgetPasswordPage()
</script>
