<template>
  <div class="flex items-center cursor-pointer gap-[6px]" @click="toggleOrder">
    <p>{{ label }}</p>

    <template v-if="sortField === field">
      <ElIcon v-if="sortOrder === SortOrder.Desc" size="12">
        <SortDescIcon :color="themeConfig.color.primary500" class="text-primary500" />
      </ElIcon>
      <ElIcon v-else size="12">
        <SortAscIcon :color="themeConfig.color.primary500" />
      </ElIcon>
    </template>

    <template v-else>
      <SortDescIcon />
    </template>
  </div>
</template>

<script setup lang="ts">
import SortAscIcon from '@/components/icon/SortAscIcon.vue'
import SortDescIcon from '@/components/icon/SortDescIcon.vue'
import { SortOrder } from '@/enum'
import { themeConfig } from '@/shared/theme'

const sortField = defineModel<string>('sortField')
const sortOrder = defineModel<SortOrder>('sortOrder')

const props = defineProps<{
  label: string
  field: string
}>()

const toggleOrder = () => {
  if (sortField.value !== props.field) {
    sortField.value = props.field
    sortOrder.value = SortOrder.Asc
    return
  }

  sortOrder.value = sortOrder.value === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
}
</script>
