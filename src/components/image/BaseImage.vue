<template>
  <ElImage v-bind="$attrs">
    <template #placeholder>
      <img :src="defaultImage" />
    </template>
    <template #error>
      <img :src="defaultImage" />
    </template>
  </ElImage>
</template>

<script setup lang="ts">
import defaultImage from '@/assets/images/placeholder-image.png'
</script>
