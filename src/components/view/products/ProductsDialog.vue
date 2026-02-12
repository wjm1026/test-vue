<template>
  <BaseDialog
    dialogTitle="商品が登録されました"
    v-model="visible"
    :width="640"
    @close="closeDialog"
  >
    <template #main>
      <div class="border-gray300 flex w-[320px] items-center rounded-sm border pt-2 pr-3 pb-2 pl-3">
        <BaseImage class="h-8 w-8 rounded-sm" :src="product.productImageUrl" />
        <div class="ml-3 flex flex-col">
          <ElText class="text-gray500 self-start text-[10px] leading-[12px] font-medium">{{
            product.maker
          }}</ElText>
          <ElText class="text-gray800 self-start text-[12px] leading-[14px]">{{
            product.productName
          }}</ElText>
        </div>
      </div>
      <BlueButton label="閉じる" class="mt-10 h-10 w-[200px]" @click="closeDialog" />
    </template>
  </BaseDialog>
</template>
<script lang="ts" setup>
import { ref, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'

import type { ProductType } from '@/api/types/products'
import { routePaths } from '@/router/routes'

const props = defineProps<{
  modelValue: boolean
  product: ProductType
}>()

const { product } = toRefs(props)
const router = useRouter()
const visible = ref(false)

const emit = defineEmits(['closeDialog'])

const closeDialog = () => {
  visible.value = false
  emit('closeDialog')
  router.push(routePaths.products.root)
}

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
  },
  { immediate: true },
)
</script>
<style scoped>
@reference '@/style/tailwindcss.css';

:deep(.el-dialog) {
  @apply !h-[260px] rounded-xl;
}
</style>
