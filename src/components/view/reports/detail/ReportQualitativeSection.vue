<template>
  <div class="space-y-4 print:space-y-6 print:break-before-page">
    <ElText class="text-base font-bold block text-gray800">定性評価</ElText>
    <QuantitativeCard>
      <template #label>
        <div class="flex items-center gap-3">
          <ElText class="text-base font-bold text-gray800 leading-4 block">コメント評価</ElText>
          <div
            class="text-xs text-primary600 font-bold flex items-center cursor-pointer no-print"
            @click="$emit('open-comments')"
          >
            <p>コメント一覧へ</p>
            <ElIcon size="20"><ArrowRightIcon /></ElIcon>
          </div>
        </div>
      </template>
      <div class="text-sm tracking-[2%]">{{ commentInsight }}</div>
    </QuantitativeCard>
    <div class="grid grid-cols-2 gap-6">
      <QuantitativeCard v-for="(section, index) in sections" :key="index">
        <template #label>
          <div class="flex items-center text-xl text-gray800 font-bold gap-1.5">
            <ElIcon size="24" class="text-gray800"><component :is="section.icon" /></ElIcon>
            <span>{{ section.title }}</span>
          </div>
        </template>
        <div class="space-y-2">
          <ReviewCard
            v-for="comment in section.topComments"
            :key="comment.rank"
            :rank="comment.rank"
            :user-icon-index="comment.userIconIndex"
            :label="`${comment.nickname} (${comment.ageGroup} / ${comment.gender})`"
            :content="comment.comment"
            :likes="comment.likeCount"
          />
          <div
            class="text-xs text-primary600 font-bold flex items-center justify-end cursor-pointer no-print"
            @click="$emit('open-comments', section.rating)"
          >
            <p>コメント一覧へ</p>
            <ElIcon size="20"><ArrowRightIcon /></ElIcon>
          </div>
        </div>
        <div class="space-y-6 text-gray800 text-sm font-bold">
          <div>
            <span class="text-base">頻出ワード</span>
            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="word in section.frequentWords"
                :key="word.rank"
                class="h-11 leading-11 border-b-1 border-b-gray400 pl-2 text-primary600"
              >
                {{ word.rank }} . {{ word.word }}
              </div>
            </div>
          </div>
          <BaseImage
            :src="sections[index].wordCloudImageUrl"
            class="w-full h-[225px] border border-gray200"
          />
          <BaseImage
            :src="sections[index].networkImageUrl"
            class="w-full h-[225px] border border-gray200"
          />
        </div>
      </QuantitativeCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { ElText, ElIcon } from 'element-plus'

import QuantitativeCard from './QuantitativeCard.vue'
import ReviewCard from './ReviewCard.vue'

import GoodIcon from '@/components/icon/GoodIcon.vue'
import BadIcon from '@/components/icon/BadIcon.vue'
import ArrowRightIcon from '@/components/icon/ArrowRightIcon.vue'
import type { QualitativeEvaluation } from '@/api/types/reportAIAnalysis'
import { CommentRating } from '@/enum'
const props = defineProps<{ qualitativeEvaluation?: QualitativeEvaluation }>()
const { qualitativeEvaluation } = toRefs(props)

const commentInsight = computed(() => qualitativeEvaluation?.value?.commentInsight ?? '')

const sections = computed(() => {
  const good = qualitativeEvaluation?.value?.good
  const bad = qualitativeEvaluation?.value?.bad

  return [
    {
      title: 'よかった別',
      icon: GoodIcon,
      rating: CommentRating.Good,
      topComments: good?.topComments ?? [],
      frequentWords: good?.frequentWords ?? [],
      wordCloudImageUrl: good?.wordCloudImageUrl,
      networkImageUrl: good?.networkImageUrl,
    },
    {
      title: 'イマイチ別',
      icon: BadIcon,
      rating: CommentRating.Bad,
      topComments: bad?.topComments ?? [],
      frequentWords: bad?.frequentWords ?? [],
      wordCloudImageUrl: bad?.wordCloudImageUrl,
      networkImageUrl: bad?.networkImageUrl,
    },
  ]
})
</script>
