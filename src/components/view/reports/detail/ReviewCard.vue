<template>
  <div
    class="relative w-full rounded-xl p-4 text-xs text-gray800 border border-gray200 bg-white transition-all duration-200 space-y-1.5"
    :class="rank ? 'pl-10' : ''"
  >
    <div v-if="rank" class="absolute top-0 left-1">
      <ElIcon size="32">
        <component :is="rankIcon" />
      </ElIcon>
    </div>
    <div class="flex items-center gap-1 font-bold">
      <BaseImage class="w-5 h-5 rounded-full" :src="avatars[avatarIndex]" />
      <span>{{ label }}</span>
    </div>
    <p>{{ content }}</p>
    <div class="flex items-center gap-1 text-primary600 font-bold">
      <ElIcon size="16"><HeartIcon /></ElIcon>
      <span>参考になった</span>
      <span>{{ formatNumberWithCommas(likes) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'

import { formatNumberWithCommas } from '@/util/form-data-helper'
import RankThreeIcon from '@/components/icon/RankThreeIcon.vue'
import RankTwoIcon from '@/components/icon/RankTwoIcon.vue'
import RankOneIcon from '@/components/icon/RankOneIcon.vue'
import { avatars } from '@/shared/avatars'

interface Props {
  rank?: number
  userIconIndex?: number
  label: string
  content: string
  likes: number
}

const props = defineProps<Props>()
const { rank, userIconIndex, label, content, likes } = toRefs(props)

const rankIndex = computed(() => (rank.value ?? 1) % 3)

const avatarIndex = computed(() => (userIconIndex.value ?? 0) % avatars.length)

const rankIcon = computed(() => {
  switch (rankIndex.value) {
    case 0:
      return RankThreeIcon
    case 1:
      return RankOneIcon
    case 2:
      return RankTwoIcon
    default:
      return RankOneIcon
  }
})
</script>
