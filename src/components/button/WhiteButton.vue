<template>
  <ElButton
    :loading="isLoading"
    :disabled="disabled"
    :class="
      twMerge(
        'rounded-sm font-bold border border-primary500 text-primary500',
        className,
        disabled
          ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-100'
          : '',
      )
    "
  >
    <slot name="prefix"></slot>
    {{ label }}
    <slot name="suffix"></slot>
  </ElButton>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

defineProps<{
  label: string
  className?: string
  isLoading?: boolean
  disabled?: boolean
}>()
</script>
