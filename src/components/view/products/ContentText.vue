<template>
  <div class="flex flex-col pb-6 font-medium" v-for="item in data" :key="item.label">
    <ElText class="self-start text-[11px] text-gray700 mb-1 leading-4">{{ item.label }}</ElText>
    <ElText class="self-start text-[14px] text-gray800 leading-[17px]">
      {{ item.text }}
    </ElText>
  </div>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    data: {
      label?: string
      text?: string
    }[]
  }>(),
  {
    data: () => [],
  },
)
</script>
