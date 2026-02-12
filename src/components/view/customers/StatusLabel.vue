<template>
  <div
    class="flex items-center justify-center w-5 h-5 rounded-full"
    :class="status === 'public' ? 'bg-success' : 'bg-gray300'"
  >
    <SuccessIcon v-if="status === 'public'" :size="12" />
  </div>
</template>

<script setup lang="ts">
import SuccessIcon from '@/components/icon/SuccessIcon.vue'

interface Props {
  status: 'public' | 'private'
}

defineProps<Props>()
</script>
