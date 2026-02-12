<template>
  <ElRadio :class="twMerge('text-gray800 font-medium', className)" v-bind="$attrs">
    <slot />
  </ElRadio>
</template>
<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

defineProps<{
  className?: string
}>()
</script>
<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-radio__input .el-radio__inner) {
  @apply w-5 h-5 border-gray400 border-[2px];
}
:deep(.el-radio__input.is-checked .el-radio__inner) {
  @apply bg-transparent border-gray400 border-[2px];
}
:deep(.el-radio__input.is-checked + .el-radio__label) {
  @apply text-gray800 font-bold;
}
:deep(.el-radio__input.is-checked .el-radio__inner:after) {
  @apply w-3 h-3 bg-primary500;
}
</style>
