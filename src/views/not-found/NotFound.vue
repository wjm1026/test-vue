<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <div class="flex flex-col gap-8 mb-[70px] w-[480px] h-[142px]">
      <ElText class="text-[24px] font-bold text-gray800 w-[430px] h-[35px]">
        お探しのページが見つかりませんでした
      </ElText>
      <ElText class="text-[14px] break-words leading-[1.75] tracking-[0.02em] text-gray800">
        大変申し訳ございません。お探しのページは移動したか、URLが古くなっている可能性があります。お手数ですが、下のボタンからトップページにお戻りいただき、もう一度お探しください。
      </ElText>
    </div>
    <BlueButton label="トップへ戻る" className="w-[200px] h-10" @click="handleBackToTop" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import BlueButton from '@/components/button/BlueButton.vue'
import { routePaths } from '@/router/routes'

const router = useRouter()

const handleBackToTop = () => {
  router.push(routePaths.projects.root)
}
</script>
