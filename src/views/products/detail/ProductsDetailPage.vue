<template>
  <LayoutMain
    :title="productDetail?.productName || '商品詳細'"
    :show-empty="isEmpty && !isFetching"
  >
    <div class="flex gap-8 h-full" v-loading="isFetching">
      <div class="w-[200px]">
        <BaseImage
          :src="imageUrl"
          class="rounded-xl h-[200px] w-[200px] mx-auto block"
          fit="contain"
        />
      </div>
      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex-1 overflow-y-scroll">
          <SectionTitle content="概要情報" />
          <ContentText :data="summary" />
          <SectionTitle content="詳細情報" />
          <ContentText :data="detail" />
        </div>
        <div>
          <WithDeleteConfirm
            @confirm="deleteHandle"
            title="商品を削除します"
            :loading="isDeleteLoading"
          >
            <template #content>
              <div
                class="border-gray300 flex h-[48px] w-[320px] items-center rounded-sm border pt-2 pr-3 pb-2 pl-3"
              >
                <BaseImage class="h-8 w-8 rounded-sm" :src="imageUrl" />
                <div class="ml-3 flex flex-col">
                  <ElText class="text-gray500 self-start text-[10px] leading-[12px] font-medium">
                    {{ productDetail?.maker }}
                  </ElText>
                  <ElText class="text-gray800 self-start text-[12px] leading-[14px]">
                    {{ productDetail?.productName }}
                  </ElText>
                </div>
              </div>
            </template>
            <WhiteButton
              label="削除する"
              class="w-[120px] h-[40px] ml-0 mr-3"
              className="border-error text-error hover:bg-error-bg"
              :disabled="!canDeleteProduct"
            />
          </WithDeleteConfirm>
          <WhiteButton label="編集する" class="w-[120px] h-[40px] ml-0" @click="updateHandle" />
        </div>
      </div>
    </div>
  </LayoutMain>
</template>
<script lang="ts" setup>
import { useProductsDetailPage } from './useProductsDetailPage'

const {
  imageUrl,
  summary,
  detail,
  productDetail,
  isFetching,
  isEmpty,
  updateHandle,
  deleteHandle,
  isDeleteLoading,
  canDeleteProduct,
} = useProductsDetailPage()
</script>
