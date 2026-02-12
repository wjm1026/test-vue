<template>
  <BaseDialog
    dialogTitle="コメントが送信されました"
    v-model="visible"
    :width="640"
    @close="closeDialog"
  >
    <template #main>
      <div class="flex flex-col items-center gap-[32px]">
        <div class="border-gray300 w-[480px] rounded-sm border p-[20px]">
          <ElText class="text-[11px] leading-[1.5] text-gray800 whitespace-pre-line">
            {{ replyContent }}
          </ElText>
        </div>
        <BlueButton label="閉じる" class="h-10 w-[200px]" @click="closeDialog" />
      </div>
    </template>
  </BaseDialog>
</template>
<script lang="ts" setup>
import {
  useCommentReplySuccessDialog,
  type CommentReplySuccessDialogProps,
  type CommentReplySuccessDialogEmit,
} from './useCommentReplySuccessDialog'

import BlueButton from '@/components/button/BlueButton.vue'

const props = defineProps<CommentReplySuccessDialogProps>()
const emit = defineEmits<CommentReplySuccessDialogEmit>()
const { visible, closeDialog } = useCommentReplySuccessDialog(props, emit)
</script>
<style scoped>
@reference '@/style/tailwindcss.css';
</style>
