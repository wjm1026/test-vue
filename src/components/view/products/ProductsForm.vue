<template>
  <div v-loading="isPending">
    <BaseForm ref="productsFormRef" :model="form" :rules="rules" label-position="top">
      <SectionTitle content="概要情報" />

      <ElFormItem label="商品名" prop="productName">
        <ElInput v-model="form.productName" maxlength="100" placeholder="商品名を入力" />
      </ElFormItem>
      <ElFormItem label="メーカー名" prop="maker">
        <ElInput v-model="form.maker" maxlength="100" placeholder="メーカー名を入力" />
      </ElFormItem>
      <ElFormItem label="JANコード" prop="janCode">
        <ElInput
          v-model="form.janCode"
          maxlength="20"
          placeholder="JANコードを入力"
          :disabled="isUsed"
        />
        <div v-if="isUsed" class="text-xs text-gray600 mt-1">
          ※ この商品はプロジェクトで使用されているため、JANコードは変更できません
        </div>
      </ElFormItem>
      <ElFormItem label="商品カテゴリ" prop="productCategory">
        <el-select-v2
          v-model="form.productCategory"
          popper-class="category-popper"
          :options="productCategory?.categories ?? []"
          :props="{
            label: 'categoryName',
            value: 'categoryId',
          }"
          placeholder="選択してください"
        />
      </ElFormItem>
      <SectionTitle content="詳細情報" />
      <ElFormItem label="商品画像" prop="productImage">
        <div v-if="productImageUrl" class="w-[120px] h-[120px] relative">
          <BaseImage
            class="w-full h-full border-[1.25px] rounded-[5px] border-gray400"
            :src="productImageUrl"
          />
          <ElIcon
            size="30"
            class="absolute top-[-10px] left-[100px] cursor-pointer"
            @click="handleRemove"
            ><DeleteIcon
          /></ElIcon>
        </div>
        <ElUpload
          v-else
          action=""
          accept="image/*"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleChange"
        >
          <ElIcon class="w-[120px] h-[120px] border-2 border-primary500 rounded-sm">
            <AddIcon class="w-[40px] h-[40px]" />
          </ElIcon>
        </ElUpload>
      </ElFormItem>
      <ElFormItem label="商品説明" prop="description">
        <ElInput
          v-model="form.description"
          class="h-[160px]"
          maxlength="400"
          show-word-limit
          type="textarea"
          placeholder="400文字以内で入力"
        />
      </ElFormItem>
      <ElFormItem>
        <WhiteButton label="キャンセル" class="w-[120px] h-10 ml-0" @click="handleCancel" />
        <BlueButton
          label="登録する"
          class="w-[120px] h-10"
          @click="formSubmit"
          :disabled="disabled"
          :loading="isSubmitProductPending"
        />
      </ElFormItem>
    </BaseForm>
  </div>
</template>

<script lang="ts" setup>
import { useProductsForm } from './useProductsForm'

import type { ProductType } from '@/api/types/products'

const emit = defineEmits<{ (e: 'successSubmit', product: ProductType): void }>()

const {
  productsFormRef,
  form,
  rules,
  disabled,
  productImageUrl,
  isSubmitProductPending,
  isPending,
  productCategory,
  isUsed,
  handleChange,
  handleRemove,
  formSubmit,
  handleCancel,
} = useProductsForm(emit)
</script>

<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-textarea__inner) {
  @apply w-full h-full;
}
:deep(.el-textarea) {
  @apply relative mb-[11px];
}
:deep(.el-textarea .el-input__count) {
  @apply bg-transparent text-[11px] text-gray500 absolute left-0 bottom-[-16px];
}
:deep(.el-form-item) {
  @apply w-[480px] mb-6;
}
:deep(.el-form-item:last-child) {
  @apply mb-1;
}

:deep(.el-textarea .el-textarea__inner) {
  @apply resize-none;
}

:global(.category-popper .el-select-dropdown__item) {
  @apply text-[11px] text-gray800;
}
</style>
