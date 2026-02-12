<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <div class="flex flex-col w-[480px] gap-[64px]">
      <ResetPasswordForm v-if="activeStep === 0" @resetPasswordSubmitSuccess="handleSuccess" />
      <ResetPasswordNotice v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { routePaths } from '@/router/routes'
import message from '@/enum/message.json'

const route = useRoute()
const router = useRouter()
const activeStep = ref(0)

onMounted(() => {
  const token = route.query.token as string | undefined

  if (!token) {
    ElMessage.error(message.login.resetPasswordInvalidToken)
    router.push(routePaths.login)
  }
})

const handleSuccess = () => {
  activeStep.value = 1
}
</script>
