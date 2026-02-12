<template>
  <ElCheckbox :class="twMerge('text-gray800 font-medium', className)" v-bind="$attrs" />
</template>
<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

defineProps<{
  className?: string
}>()
</script>
<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-checkbox__input .el-checkbox__inner) {
  @apply w-4.5 h-4.5 border-gray400 border-[2px];
}
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  @apply bg-primary500 border-primary500 border-[2px];
}
:deep(.el-checkbox__input + .el-checkbox__label) {
  @apply text-gray700 font-medium text-[11px];
}
</style>
