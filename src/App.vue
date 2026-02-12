<template>
  <ElConfigProvider :locale="elementLocale">
    <RouterView />
    <GlobalErrorDialog />
    <GlobalLoading />
  </ElConfigProvider>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Language } from 'element-plus/es/locale'
import ja from 'element-plus/es/locale/lang/ja'

import GlobalErrorDialog from '@/components/dialog/GlobalErrorDialog.vue'
import GlobalLoading from '@/components/common/GlobalLoading.vue'

const elementLocale = ref<Language>(ja)
</script>

