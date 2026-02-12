<template>
  <BaseDialog dialogTitle="コメント返信" v-model="visible" :width="640" @close="closeDialog">
    <template #main>
      <div class="flex flex-col items-center gap-[12px]">
        <BaseForm :model="form">
          <ElFormItem prop="commentReply">
            <ElInput
              v-model="form.commentReply"
              class="w-[400px] h-[120px]"
              maxlength="400"
              show-word-limit
              type="textarea"
              placeholder="400文字以内でコメントを入力してください"
            />
          </ElFormItem>
        </BaseForm>
        <div class="w-[252px] h-10">
          <WhiteButton label="キャンセル" class="w-[120px] h-10" @click="closeDialog" />
          <BlueButton
            label="送信する"
            class="w-[120px] h-10"
            @click="CommentReplySubmit"
            :disabled="form.commentReply.trim() === ''"
            :loading="isPending"
          />
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
<script lang="ts" setup>
import {
  useCommentReplyDialog,
  type CommentReplyDialogProps,
  type CommentReplyDialogEmit,
} from './useCommentReplyDialog'

const props = defineProps<CommentReplyDialogProps>()
const emit = defineEmits<CommentReplyDialogEmit>()
const { visible, form, CommentReplySubmit, closeDialog } = useCommentReplyDialog(props, emit)
</script>
<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-textarea__inner) {
  @apply w-full h-full;
  @apply text-[11px] text-gray800;
}

:deep(.el-textarea) {
  @apply relative mb-[11px];
}

:deep(.el-textarea .el-input__count) {
  @apply bg-transparent text-[11px] text-gray500 absolute left-0 bottom-[-16px];
}

:deep(.el-textarea .el-textarea__inner) {
  @apply resize-none;
}
</style>
