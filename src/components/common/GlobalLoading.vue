<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isRefreshing"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90"
      >
        <div
          class="h-10 w-10 animate-spin rounded-full border-3 border-gray-200 border-t-primary500"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const { isRefreshing } = storeToRefs(authStore)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
