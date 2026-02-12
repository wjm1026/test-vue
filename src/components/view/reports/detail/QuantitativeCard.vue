<template>
  <div class="border border-gray300 rounded-xl text-gray800 bg-gray100 px-10 py-8 space-y-6">
    <template v-if="$slots.label">
      <slot name="label"></slot>
    </template>
    <ElText v-else class="text-base font-bold text-gray800 leading-4 block">{{ label }}</ElText>
    <div class="flex flex-col gap-8">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: '',
  },
)
</script>
