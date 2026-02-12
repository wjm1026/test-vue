<template>
  <svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20.0469 0C21.4275 9.77408e-05 22.5468 1.11941 22.5469 2.5V17.5H37.5469C38.9275 17.5001 40.0459 18.6194 40.0459 20C40.0459 21.3806 38.9275 22.4999 37.5469 22.5H22.5469V37.5C22.5468 38.8806 21.4275 39.9999 20.0469 40C18.6663 39.9999 17.547 38.8806 17.5469 37.5V22.5H2.54688C1.16618 22.5 0.0468749 21.3807 0.046875 20C0.0468749 18.6193 1.16618 17.5 2.54688 17.5H17.5469V2.5C17.5469 1.1194 18.6663 7.65466e-05 20.0469 0Z"
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
