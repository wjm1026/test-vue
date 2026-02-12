<template>
  <div class="flex h-screen w-full print:h-auto print:block">
    <Sidebar class="no-print" />
    <ElMain
      class="p-0 flex flex-col pb-12 px-14 relative print:px-8 print:pt-0 print:block print:h-auto"
    >
      <div
        class="space-y-8 sticky top-0 z-10 py-8 bg-white space-y-4 transition-all duration-300 print:static print:py-4"
      >
        <div
          class="flex items-center gap-[2px] cursor-pointer no-print"
          v-if="showBackButton"
          @click="router.go(-1)"
        >
          <ElIcon size="20">
            <BackIcon />
          </ElIcon>
          <ElText class="text-black text-xs font-bold">戻る</ElText>
        </div>
        <slot name="title">
          <ElText v-if="title" class="self-start text-gray800 text-2xl font-bold">
            {{ title }}
          </ElText>
        </slot>
      </div>
      <div class="flex flex-col flex-1 min-h-0 print:block print:h-auto print:min-h-full">
        <div class="flex-1 min-h-0 print:block print:h-auto print:min-h-full">
          <template v-if="showEmpty">
            <slot name="empty">
              <div class="flex flex-col items-center justify-center flex-1 min-h-[400px]">
                <ElEmpty :description="emptyMessage" />
              </div>
            </slot>
          </template>
          <slot v-else />
        </div>
        <div class="flex items-center justify-between mt-4" v-if="showPagination">
          <div class="flex-shrink-0">
            <slot name="pagination-left" />
          </div>
          <ElPagination
            layout="prev, pager, next"
            :total="total"
            :current-page="page"
            :page-size="pageSize"
            @current-change="(page: number) => emit('pageChange', page)"
          />
        </div>
      </div>
    </ElMain>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'

import BackIcon from '@/components/icon/BackIcon.vue'
import { pageSize } from '@/enum'

interface PropsType {
  title?: string
  showPagination?: boolean
  total?: number
  page?: number
  showEmpty?: boolean
  emptyMessage?: string
  showBackButton?: boolean
}

const router = useRouter()

withDefaults(defineProps<PropsType>(), {
  title: '',
  showPagination: false,
  showEmpty: false,
  emptyMessage: 'データがありません',
  showBackButton: true,
})

const emit = defineEmits<{
  (event: 'pageChange', page: number): void
}>()
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-pager li),
:deep(.el-pagination button) {
  @apply border border-gray300 rounded-sm mr-[6px];
}

:deep(.el-pager li.is-active) {
  @apply bg-primary500 text-white border-0;
}
</style>
