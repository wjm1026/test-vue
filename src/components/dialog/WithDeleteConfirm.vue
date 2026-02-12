<template>
  <span class="inline-block" @click.stop.prevent="openDialog">
    <slot />
  </span>
  <BaseDialog v-model="visible" :dialogTitle="title" append-to-body>
    <template #main>
      <slot name="content">
        <ElText class="text-gray700 text-[14px] leading-6 text-center">
          {{ message }}
        </ElText>
      </slot>
      <BlueButton
        :label="confirmLabel"
        class="mt-10 h-10 w-[200px]"
        @click="handleConfirm"
        :loading="loading"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import BaseDialog from '@/components/dialog/BaseDialog.vue'
import messages from '@/enum/message.json'

interface PropsType {
  title?: string
  message?: string
  loading?: boolean
  confirmLabel?: string
}

const props = withDefaults(defineProps<PropsType>(), {
  title: messages.dialog.deleteConfirmTitle,
  message: messages.dialog.deleteConfirm,
  loading: false,
  confirmLabel: '削除する',
})

const emit = defineEmits<{
  confirm: []
}>()

const visible = ref(false)

const openDialog = () => {
  visible.value = true
}
watch(
  () => props.loading,
  (newVal) => {
    if (!newVal) {
      visible.value = false
    }
  },
)

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
@reference '@/style/tailwindcss.css';
</style>
