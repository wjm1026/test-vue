<template>
  <BaseForm
    ref="projectsFormRef"
    :model="projectsForm"
    label-position="top"
    :rules="projectsFormRules"
  >
    <ElFormItem label="プロジェクト名" prop="name">
      <ElInput
        v-model="projectsForm.name"
        placeholder="名称未設定"
        class="h-[45px] w-[480px] text-[16px] font-bold"
        :disabled="isProjectStarted"
        maxlength="100"
      />
    </ElFormItem>
    <ElFormItem
      label="実施期間"
      prop="dateRange"
      :class="['mb-8', 'date-range-form-item', projectsForm.startDate ? 'has-start-date' : '']"
    >
      <div>
        <div class="flex items-center gap-2">
          <BaseDatePicker
            v-model="projectsForm.startDate"
            placeholder="開始日"
            format="YYYY/MM/DD"
            :disabled-date="disabledStartDate"
            :disabled="isProjectStarted"
          />
          <ElText class="text-gray700 text-[11px]">～</ElText>
          <BaseDatePicker
            v-model="projectsForm.endDate"
            placeholder="終了日"
            format="YYYY/MM/DD"
            :disabled-date="disabledEndDate"
            :disabled="isProjectEnded"
          />
        </div>
        <div class="flex flex-col items-start">
          <ElText class="text-gray-500 text-[10px] block">
            ※実施期間（終了日）が不明の場合は2999年12月31日などを設定してください。
          </ElText>
          <ElText
            v-if="showDateWarning"
            class="text-orange-500 leading-1 mb-1 text-[12px] self-start"
          >
            {{ message.project.dateWarning }}
          </ElText>
        </div>
      </div>
    </ElFormItem>

    <div class="mb-[42px] purchase-publish-date-range">
      <ElFormItem label="対象商品の購入期間" class="flex mb-1">
        <ElInput :value="purchaseDateRange" :disabled="true" class="w-[200px]" />
      </ElFormItem>
      <ElFormItem label="プロジェクト公開期間" class="flex">
        <ElInput :value="publishDateRange" :disabled="true" class="w-[200px]" />
      </ElFormItem>
    </div>
    <ElFormItem label="対象商品" prop="targetProduct">
      <div class="relative">
        <ElButton
          class="border-primary500 text-primary500 rounded-sm border text-[11px]"
          :disabled="isProjectStarted"
          @click="targetProductHandle"
        >
          <ElIcon size="16" class="mr-[4px]">
            <TargetAddIcon />
          </ElIcon>
          商品一覧から選ぶ
        </ElButton>
      </div>
      <div
        v-if="targetProduct.length"
        class="border-gray300 mt-4 w-full rounded-sm border p-[20px]"
      >
        <ProductsTable :data="targetProduct" :isDetail="false" :isSort="false" height="200px">
          <template #actionColumn>
            <ElIcon
              size="16"
              :class="isProjectStarted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
              @click="deleteProductHandle"
            >
              <DeleteIcon />
            </ElIcon>
          </template>
        </ProductsTable>
      </div>
    </ElFormItem>
    <ElFormItem label="付与ポイント" prop="point">
      <ElInput
        v-model="projectsForm.point"
        class="w-[480px] text-xs"
        :disabled="isProjectStarted"
        @input="handlePointInput"
      />
      <span
        ref="measureRef"
        class="invisible absolute top-1/2 left-3 -translate-y-1/2 text-[11px] whitespace-pre"
      >
        {{ projectsForm.point }}
      </span>
      <span
        v-if="projectsForm.point !== undefined"
        class="text-gray700 pointer-events-none absolute top-1/2 -translate-y-1/2 text-[10px]"
        :style="{ left: unitLeft + 'px', marginLeft: '4px' }"
      >
        pt
      </span>
    </ElFormItem>
    <SectionTitle content="オプション" />
    <ElFormItem label="プロジェクトの優先表示" prop="priority">
      <div class="flex flex-col">
        <ElText class="text-[11px]">
          みんなのレビュー一覧上で優先的にプロジェクトを表示することができます
        </ElText>
        <ElSwitch
          class="w-10 h-6"
          v-model="projectsForm.priorityFlag"
          :active-value="1"
          :inactive-value="0"
          :disabled="isProjectEnded"
        />
        <ElText class="text-[11px] self-start">優先順位</ElText>
        <ElInput
          v-model="projectsForm.priority"
          :disabled="projectsForm.priorityFlag === 0 || isProjectEnded"
          placeholder="1~10の値を入力"
          class="w-[104px]"
        />
      </div>
    </ElFormItem>
    <ElFormItem>
      <WhiteButton label="キャンセル" class="w-[120px] h-10 ml-0" @click="router.go(-1)" />
      <BlueButton
        label="作成する"
        class="h-11 w-[120px]"
        @click="createProjectSubmit"
        :disabled="disabled"
        :loading="isPending"
      />
    </ElFormItem>
  </BaseForm>
  <TargetProductDialog
    v-if="productVisible"
    v-model="productVisible"
    :janCode="janCode"
    :product="targetProduct[0]"
    @closeTargetProduct="closeTargetProduct"
    @chooseTargetProduct="chooseTargetProduct"
  />
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useProjectsForm } from './useProjectsForm'

import message from '@/enum/message.json'
import type { RegistrationProjectData } from '@/api/types/projects'

const router = useRouter()

const emit = defineEmits<{
  successProjectSubmit: [project: RegistrationProjectData]
}>()

const {
  projectsForm,
  projectsFormRef,
  projectsFormRules,
  disabled,
  productVisible,
  targetProduct,
  janCode,
  measureRef,
  unitLeft,
  showDateWarning,
  isPending,
  isProjectEnded,
  isProjectStarted,
  purchaseDateRange,
  publishDateRange,
  targetProductHandle,
  createProjectSubmit,
  closeTargetProduct,
  chooseTargetProduct,
  deleteProductHandle,
  disabledStartDate,
  disabledEndDate,
  handlePointInput,
} = useProjectsForm(emit)

onMounted(async () => {
  handlePointInput(String(projectsForm.point))
})
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

.purchase-publish-date-range {
  :deep(.el-form-item__label) {
    width: 135px;
    margin-bottom: 0;
  }
}

:deep(
  .el-form-item:first-child:not(.purchase-publish-date-range .el-form-item) .el-input__wrapper
) {
  @apply rounded-none border-0 border-b border-gray300 shadow-none transition-colors;
}

:deep(.el-form-item:first-child:not(.purchase-publish-date-range .el-form-item) .el-input__inner) {
  @apply text-gray800 text-base font-bold;
}

:deep(.el-form-item:first-child.is-error .el-input__wrapper.is-focus) {
  @apply shadow-none;
}

:deep(.el-form-item:first-child.is-error .el-input__wrapper) {
  @apply border-b-red-500;
}

:deep(.el-form-item__label) {
  @apply text-gray800 font-bold;
}

:deep(.el-form-item) {
  @apply mb-[32px];
}

:deep(.el-form-item:last-child) {
  @apply mb-1;
}

:deep(.date-range-form-item .el-form-item__error) {
  @apply pt-0 ml-0;
}

:deep(.date-range-form-item.has-start-date .el-form-item__error) {
  @apply ml-[147px];
}

:deep(.date-range-form-item .el-form-item__label::after) {
  @apply content-['必須'] inline-block ml-1 h-3 w-6 rounded-[2px] text-center bg-error text-[8px] leading-3 font-bold text-white align-middle;
}
</style>
