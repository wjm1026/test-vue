<template>
  <BlueButton :label="label" className="w-[120px] h-10" />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: '新規作成',
  },
)
</script>
