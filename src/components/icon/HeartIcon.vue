<template>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.90108 13.4199C8.39441 13.8799 7.61441 13.8799 7.10775 13.4133L7.03441 13.3466C3.53441 10.1799 1.24775 8.10661 1.33441 5.51995C1.37441 4.38661 1.95441 3.29995 2.89441 2.65995C4.65441 1.45995 6.82775 2.01995 8.00108 3.39328C9.17441 2.01995 11.3477 1.45328 13.1077 2.65995C14.0477 3.29995 14.6277 4.38661 14.6677 5.51995C14.7611 8.10661 12.4677 10.1799 8.96774 13.3599L8.90108 13.4199Z"
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
