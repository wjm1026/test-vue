<template>
  <LayoutMain title="商品情報個別登録">
    <ProductsForm class="pb-8" @successSubmit="successSubmit" />
    <ProductsDialog
      v-if="registrationVisible"
      v-model="registrationVisible"
      :product="product"
      @closeDialog="() => (registrationVisible = false)"
    />
  </LayoutMain>
</template>
<script lang="ts" setup>
import { useProductsRegistrationPage } from './useProductsRegistrationPage'

const { registrationVisible, product, successSubmit } = useProductsRegistrationPage()
</script>
