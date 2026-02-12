<template>
  <ElButton
    :color="themeConfig.color.primary500"
    :class="twMerge('rounded-sm font-bold disabled:bg-gray400 disabled:border-none', className)"
    :disabled="disabled"
    :loading="isLoading"
  >
    {{ label }}
  </ElButton>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

import { themeConfig } from '@/shared/theme'

interface PropsType {
  label: string
  className?: string
  disabled?: boolean
  isLoading?: boolean
}

withDefaults(defineProps<PropsType>(), {
  disabled: false,
  isLoading: false,
})
</script>
