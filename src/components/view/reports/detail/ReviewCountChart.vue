<template>
  <div class="space-y-4">
    <div
      v-for="item in chartCountData"
      :key="item.label"
      class="h-6 flex items-center gap-4 text-xs font-medium"
    >
      <div
        :class="
          twMerge(
            'w-17 text-right whitespace-nowrap',
            labelClass,
            isActive(item) ? activeLabelClass : '',
          )
        "
      >
        {{ item.label }}
      </div>
      <div class="flex-1 flex items-center gap-1">
        <div
          class="h-6 transition-all"
          :class="twMerge(isActive(item) ? activeBarClass : barColorClass)"
          :style="{
            width: `calc((100% - 48px) * ${(item.value / maxValue).toFixed(4)})`,
            transitionDuration: duration + 'ms',
          }"
        ></div>

        <div class="flex items-center text-gray800">
          <span class="text-sm" :class="twMerge(isActive(item) ? activeLabelClass : '')">
            {{ item.value }}
          </span>
          <span
            v-if="unit"
            class="text-[11px] mt-[3px]"
            :class="twMerge(isActive(item) ? activeLabelClass : '')"
          >
            {{ unit }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { twMerge } from 'tailwind-merge'

interface BarItem {
  label: string
  value: number
  active?: boolean
}

interface Props {
  data: BarItem[]
  unit?: string
  barColorClass?: string
  duration?: number
  labelClass?: string
  activeLabelClass?: string
  activeBarClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  unit: '',
  barColorClass: 'bg-primary300',
  duration: 400,
  labelClass: 'text-gray700',
  activeLabelClass: 'text-primary600 font-bold',
  activeBarClass: 'bg-primary500',
})

const chartCountData = computed(() => props.data)

const maxValue = computed(() => Math.max(...props.data.map((d) => d.value)))

const isActive = (item: BarItem) => item?.active || item.value === maxValue.value
</script>
