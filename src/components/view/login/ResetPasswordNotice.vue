<template>
  <div class="flex flex-col gap-8">
    <ElText class="text-gray800 text-2xl font-bold">パスワードを再設定しました</ElText>
    <ElText class="text-gray800">
      ログインページから新しいパスワードでログインしてください。
    </ElText>
  </div>
  <div class="flex justify-center">
    <BlueButton label="ログインページへ" class="w-[200px] h-[48px]" @click="loginHandle" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { routePaths } from '@/router/routes'

const router = useRouter()

const loginHandle = () => router.push(routePaths.login)
</script>
