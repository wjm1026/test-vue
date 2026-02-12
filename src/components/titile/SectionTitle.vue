<template>
  <div class="text-gray500 text-[11px] border-b border-gray400 mb-5">
    {{ content }}
  </div>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    content?: string
  }>(),
  {
    content: '概要情報',
  },
)
</script>
