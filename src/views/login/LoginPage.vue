<template>
  <div class="flex justify-center items-center flex-col h-screen gap-16">
    <BaseImage :src="logoImage" class="h-[84px] w-[450px]" />
    <LoginForm ref="loginFormRef" />
  </div>
</template>
<script setup lang="ts">
import logoImage from '@/assets/images/logo.png'
</script>
