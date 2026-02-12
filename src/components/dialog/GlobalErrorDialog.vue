<template>
  <BaseDialog
    v-model="visible"
    :width="640"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    append-to-body
  >
    <template #main>
      <div class="flex flex-col items-center gap-10">
        <div class="flex flex-col items-center gap-8 self-stretch">
          <ElText class="text-gray800 text-center text-[20px] font-semibold leading-[20px]">
            情報の読み込みに失敗しました
          </ElText>
          <ElText class="text-gray800 text-center text-[14px] leading-[24.5px] tracking-[0.02em]">
            大変申し訳ございません。通信状況に問題がある可能性があります。Wi-Fi接続またはモバイルデータ通信をご確認のうえ、下のボタンからもう一度お試しください。
          </ElText>
        </div>
        <div class="flex flex-col gap-3">
          <BlueButton label="もう一度試す" className="h-10 w-[200px]" @click="handleRetry" />
          <WhiteButton
            label="トップへ戻る"
            className="h-10 w-[200px] text-primary600 ml-0"
            @click="handleGoToTop"
          />
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import BlueButton from '@/components/button/BlueButton.vue'
import WhiteButton from '@/components/button/WhiteButton.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { routePaths } from '@/router/routes'
import { useErrorStore } from '@/stores/error'

const errorStore = useErrorStore()
const router = useRouter()

const visible = computed({
  get: () => errorStore.showErrorDialog,
  set: (value) => {
    if (!value) {
      errorStore.hideError()
    }
  },
})

const handleRetry = () => {
  errorStore.hideError()
  window.location.reload()
}

const handleGoToTop = () => {
  router.push(routePaths.projects.root)
  errorStore.hideError()
}
</script>

<style scoped>
@reference '@/style/tailwindcss.css';
</style>
