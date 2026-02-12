<template>
  <ElForm ref="formRef" :model="model" :rules="rules" v-bind="$attrs">
    <slot />
  </ElForm>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

defineProps({
  model: { type: Object, required: true },
  rules: { type: Object, default: () => ({}) },
})

const formRef = ref<FormInstance>()

defineExpose({
  validate: (callback?: (valid: boolean) => void) => {
    return formRef.value?.validate(callback)
  },
  resetFields: () => {
    formRef.value?.resetFields()
  },
  clearValidate: (props?: string | string[]) => {
    formRef.value?.clearValidate(props)
  },
  formRef,
})
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-form-item__label) {
  @apply leading-[17px] text-xs text-gray800 font-bold flex items-center gap-1;
}

:deep(.el-form-item.is-required .el-form-item__label::before) {
  content: none !important;
}

:deep(.el-form-item.is-required .el-form-item__label::after) {
  content: '必須';
  @apply w-6 h-3 text-red-600 bg-error text-[8px] text-white font-bold text-center leading-3 rounded-xs gap-[10px];
}

:deep(.el-input__wrapper) {
  @apply text-[11px] text-gray800;
}

:deep(.el-select__wrapper) {
  @apply text-[11px] text-gray800;
}

:deep(.el-textarea__inner) {
  @apply text-[11px] text-gray800;
}
</style>
