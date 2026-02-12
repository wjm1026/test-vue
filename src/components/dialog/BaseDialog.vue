<template>
  <ElDialog
    :width="width"
    v-bind="$attrs"
    align-center
    :close-on-click-modal="false"
    :class="twMerge('base-dialog rounded-xl pr-10 pb-10 pl-10', className)"
  >
    <div class="flex h-full flex-col items-center">
      <template v-if="$slots.title">
        <slot name="title" />
      </template>
      <ElText v-else class="text-gray800 mb-8 text-[20px] font-bold">{{ dialogTitle }}</ElText>
      <slot name="main" />
    </div>
  </ElDialog>
</template>
<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

withDefaults(
  defineProps<{
    width?: number
    dialogTitle?: string
    className?: string
  }>(),
  {
    width: 640,
    dialogTitle: '',
  },
)
</script>
<style>
@reference '@/style/tailwindcss.css';

.base-dialog {
  @apply flex flex-col overflow-auto;
}
.base-dialog .el-dialog__body {
  @apply min-h-0 flex-1;
}
</style>
