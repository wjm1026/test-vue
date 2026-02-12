<template>
  <div class="space-y-4">
    <div v-for="item in chartData" :key="item.label" class="flex items-center gap-4">
      <div
        v-show="isShowLabel"
        :class="
          twMerge(
            'w-17 whitespace-nowrap text-right text-xs',
            labelClass,
            isActive(item) ? activeLabelClass : '',
          )
        "
      >
        {{ item.label }}
      </div>
      <div class="flex-1 h-6 flex text-[11px] relative">
        <div
          v-if="item.good > 0"
          :class="
            twMerge(
              'font-medium flex items-center justify-center',
              isActive(item) ? activeBarClass : barColorClass,
            )
          "
          :style="{ width: item.good + '%' }"
        >
          <span class="text-sm">{{ item.good }}</span>
          <span class="mt-[3px]">%</span>
          <div
            v-if="isShowTotal"
            class="h-5 leading-5 flex items-center text-base font-bold absolute left-0 top-full mt-1.5"
          >
            <ElIcon size="20" class="text-primary600"><GoodIcon /> </ElIcon>
            <span class="text-primary600 ml-1 mr-2">{{ goodLabel }}</span>
            <span class="text-primary600">{{ totalCount?.good ?? 0 }}</span>
            <span class="h-3 leading-3 mt-1 text-primary600 text-xs">{{ unit }}</span>
          </div>
        </div>
        <div
          v-if="item.bad > 0"
          class="bg-gray300 font-medium flex items-center justify-center"
          :style="{ width: item.bad + '%' }"
        >
          <span class="text-[14px]">{{ item.bad }}</span>
          <span class="mt-[3px]">%</span>
          <div
            v-if="isShowTotal"
            class="h-5 leading-5 flex items-center text-base text-gray800 font-medium absolute right-0 top-full mt-1.5"
          >
            <span class="text-gray800">{{ totalCount?.bad ?? 0 }}</span>
            <span class="h-3 leading-3 mt-1 text-xs">{{ unit }}</span>
            <span class="ml-2 mr-1">{{ badLabel }}</span>
            <ElIcon size="20"><BadIcon /> </ElIcon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { twMerge } from 'tailwind-merge'

interface SatisfactionItem {
  label?: string
  good: number
  bad: number
}
interface Props {
  isShowLabel?: boolean
  isShowTotal?: boolean
  data: SatisfactionItem[]
  totalCount?: {
    good: number
    bad: number
  }
  unit?: string
  goodLabel?: string
  badLabel?: string
  barColorClass?: string
  labelClass?: string
  activeLabelClass?: string
  activeBarClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  isShowLabel: true,
  isShowTotal: false,
  unit: '',
  goodLabel: 'よかった',
  badLabel: 'イマイチ',
  barColorClass: 'bg-primary300',
  labelClass: 'text-gray700',
  activeLabelClass: 'text-primary600 font-bold',
  activeBarClass: 'text-white font-bold bg-primary500',
})

const chartData = computed(() => props.data)

const maxGood = computed(() => Math.max(...props.data.map((d) => d.good)))

const isActive = (item: SatisfactionItem) => {
  return item.good === maxGood.value
}
</script>
