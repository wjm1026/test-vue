<template>
  <ElInput
    class="text-[11px] border-gray300"
    :placeholder="placeholder"
    v-model="input"
    maxlength="100"
  >
    <template #prefix>
      <ElIcon size="16">
        <SearchIcon />
      </ElIcon>
    </template>
  </ElInput>
</template>

<script setup lang="ts">
import SearchIcon from '@/components/icon/SearchIcon.vue'

defineProps<{
  placeholder: string
}>()

const input = defineModel<string>()
</script>
