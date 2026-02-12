<template>
  <BaseDialog
    v-model="projectVisible"
    dialogTitle="プロジェクトが作成されました"
    @close="closeProjectDialog"
  >
    <template #main>
      <div
        class="border-gray300 flex min-w-[320px] items-center rounded-sm border pt-2 pr-3 pb-2 pl-3"
      >
        <BaseImage class="h-8 w-8 rounded-sm" :src="imageUrl" />
        <div class="ml-3 flex flex-col">
          <ElText class="text-gray800 self-start text-[12px] leading-[14px]">
            {{ project.name }}
          </ElText>
          <ElText class="text-gray500 self-start text-[10px] leading-[12px] font-medium">
            {{ project.startDate }} ~ {{ project.endDate }}
          </ElText>
        </div>
      </div>
      <BlueButton label="閉じる" class="mt-10 h-10 w-[200px]" @click="closeProjectDialog" />
    </template>
  </BaseDialog>
</template>
<script setup lang="ts">
import { uesCreateProjectDialog } from './useCreateProjectDialog'

import type { RegistrationProjectData } from '@/api/types/projects'
const props = defineProps<{
  modelValue: boolean
  project: RegistrationProjectData
}>()

const emit = defineEmits(['closeDialog'])

const { projectVisible, imageUrl, closeProjectDialog } = uesCreateProjectDialog(props, emit)
</script>
