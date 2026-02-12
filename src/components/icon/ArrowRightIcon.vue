<template>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.73984 13.2333L10.9732 9.99998L7.73984 6.76665C7.41484 6.44165 7.41484 5.91665 7.73984 5.59165C8.06484 5.26665 8.58984 5.26665 8.91484 5.59165L12.7398 9.41665C13.0648 9.74165 13.0648 10.2667 12.7398 10.5917L8.91484 14.4166C8.58984 14.7416 8.06484 14.7416 7.73984 14.4166C7.42318 14.0916 7.41484 13.5583 7.73984 13.2333Z"
      :fill="color"
    />
  </svg>
</template>
<script setup lang="ts">
import { themeConfig } from '@/shared/theme'
withDefaults(
  defineProps<{
    color?: string
  }>(),
  {
    color: themeConfig.color.primary500,
  },
)
</script>
