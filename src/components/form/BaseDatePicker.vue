<template>
  <div>
    <ElDatePicker
      v-bind="$attrs"
      type="date"
      :class="twMerge('w-[120px] text-[11px] relative', className)"
      :clearable="clearable"
      :prefix-icon="iconPrefix"
      :editable="false"
    >
    </ElDatePicker>
  </div>
</template>
<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { h, shallowRef } from 'vue'
import { twMerge } from 'tailwind-merge'

import DateIcon from '@/components/icon/DateIcon.vue'

defineProps<{
  className?: string
  clearable?: boolean
}>()

const iconPrefix = shallowRef({
  render() {
    return h(
      ElIcon,
      {
        size: 14,
      },
      () => [h(DateIcon)],
    )
  },
})
</script>
<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-date-editor .el-input__prefix) {
  @apply absolute right-0;
}

:deep(.clear-icon) {
  @apply absolute right-6 text-[12px];
}
</style>
