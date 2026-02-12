<template>
  <div class="flex flex-col gap-8">
    <ElText class="text-gray800 text-2xl font-bold">
      パスワードの再設定メールを送信しました
    </ElText>
    <ElText class="text-gray800">
      届いたメールに記載されているURLからパスワードの再設定を行ってください。メールが届かない場合は、ログインページから再度送信してください。
    </ElText>
  </div>
  <div class="flex flex-col gap-8 items-center">
    <WhiteButton label="ログインページへ" class="w-[200px] h-[48px] ml-0" @click="loginHandle" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { routePaths } from '@/router/routes'

const router = useRouter()

const loginHandle = () => router.push(routePaths.login)
</script>
