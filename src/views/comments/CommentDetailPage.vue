<template>
  <LayoutMain :show-empty="isEmpty && !isLoading">
    <div class="flex flex-col gap-8 pb-8" v-loading="isLoading">
      <div v-if="commentDetail" class="flex flex-col gap-8">
        <div class="flex items-center gap-3">
          <SuccessIcon :size="20" v-if="commentDetail.displayFlag === 1" />
          <ErrorIcon :size="20" v-else />
          <ElText class="text-2xl font-bold text-gray800">
            コメントID: {{ commentDetail.reviewId }}
          </ElText>
        </div>

        <BlueButton
          v-if="!isReply"
          label="コメントに返信する"
          class="h-10 w-fit px-4"
          @click="handleReply"
        />

        <div v-else class="border-gray300 rounded-sm border p-[20px]">
          <div class="flex items-center gap-1 mb-2">
            <ElText class="text-[14px] font-bold mr-2"> 返信コメント </ElText>
            <ElIcon size="14" class="cursor-pointer" @click="handleReply">
              <EditIcon />
            </ElIcon>
            <WithDeleteConfirm
              @confirm="handleDeleteReply"
              title="返信コメントを削除します"
              :loading="isDeleteLoading"
            >
              <ElIcon size="16" class="cursor-pointer">
                <TrashIcon />
              </ElIcon>
            </WithDeleteConfirm>
          </div>
          <ElText class="text-[14px] whitespace-pre-line">
            {{ commentDetail.reply }}
          </ElText>
        </div>

        <div class="flex flex-col gap-5 w-full max-w-4xl">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
              <ElText class="text-gray700 text-[11px] self-start">コメント</ElText>
              <ElText class="text-gray800 text-[14px] self-start">
                {{ commentDetail.comment }}
              </ElText>
            </div>

            <div class="flex flex-col gap-2">
              <ElText class="text-gray700 text-[11px] self-start">レビュー評価</ElText>
              <ElText class="text-gray800 text-[14px] self-start">
                {{ getCommentRatingLabel(commentDetail.rating) }}
              </ElText>
            </div>

            <div class="flex flex-col gap-2">
              <ElText class="text-gray700 text-[11px] self-start">投稿日</ElText>
              <ElText class="text-gray800 text-[14px] self-start">
                {{ formatDate(commentDetail.createdAt, DATE_TIME_FORMAT) }}
              </ElText>
            </div>

            <div class="flex flex-col gap-1.5">
              <ElText class="text-gray700 text-[11px] self-start">プロジェクトID</ElText>
              <ElLink
                underline="always"
                class="comment-link text-primary600 text-[14px] font-medium self-start"
                @click="handleProjectClick"
              >
                {{ commentDetail.projectId }}
              </ElLink>
            </div>

            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <ElText class="text-gray700 text-[11px] self-start">商品名</ElText>
                <ElText class="text-gray800 text-[14px] self-start">
                  {{ commentDetail.productName }}
                </ElText>
              </div>
              <BaseImage
                v-if="commentDetail.imageUrl"
                :src="commentDetail.imageUrl"
                fit="cover"
                class="w-30 h-30 border-2 border-gray400 rounded"
              />
            </div>

            <div class="flex flex-col gap-2">
              <ElText class="text-gray700 text-[11px] self-start">顧客ID</ElText>
              <ElLink
                class="comment-link text-primary600 text-[14px] font-medium self-start"
                underline="always"
                @click="handleCustomerClick"
              >
                {{ commentDetail.userId }}
              </ElLink>
            </div>

            <div class="flex flex-col gap-2">
              <ElText class="text-gray700 text-[11px] self-start">顧客ニックネーム</ElText>
              <ElText class="text-gray800 text-[14px] self-start">
                {{ commentDetail.nickName }}
              </ElText>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutMain>
  <CommentReplyDialog
    v-model="commentReplyVisible"
    :isPending="isPending"
    :initialReply="commentDetail?.reply || ''"
    @commentReplySubmit="handleSubmitReply"
    @closeDialog="handleCloseDialog"
  />
  <CommentReplySuccessDialog
    v-model="commentReplySuccessVisible"
    :replyContent="submittedReplyContent"
    @closeDialog="handleCloseSuccessDialog"
  />
</template>

<script setup lang="ts">
import { useCommentDetail } from './useCommentDetail'

import SuccessIcon from '@/components/icon/SuccessIcon.vue'
import ErrorIcon from '@/components/icon/ErrorIcon.vue'
import EditIcon from '@/components/icon/EditIcon.vue'
import TrashIcon from '@/components/icon/TrashIcon.vue'
import BlueButton from '@/components/button/BlueButton.vue'
import LayoutMain from '@/components/layout/LayoutMain.vue'
import CommentReplyDialog from '@/components/view/comments/CommentReplyDialog.vue'
import CommentReplySuccessDialog from '@/components/view/comments/CommentReplySuccessDialog.vue'
import { getCommentRatingLabel } from '@/util/comment'
import { DATE_TIME_FORMAT } from '@/enum/constants'
import { formatDate } from '@/util/date-format'

const {
  commentDetail,
  isLoading,
  isEmpty,
  commentReplyVisible,
  commentReplySuccessVisible,
  submittedReplyContent,
  isReply,
  isPending,
  isDeleteLoading,
  handleReply,
  handleDeleteReply,
  handleSubmitReply,
  handleCloseDialog,
  handleCloseSuccessDialog,
  handleProjectClick,
  handleCustomerClick,
} = useCommentDetail()
</script>
<style scoped>
.comment-link {
  --el-link-text-color: currentColor;
}
</style>
