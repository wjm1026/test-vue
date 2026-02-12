import { ref } from 'vue'

import type { ProductType } from '@/api/types/products'

export const useProductsRegistrationPage = () => {
  const registrationVisible = ref(false)
  const product = ref<ProductType>({
    productImageUrl: '',
    productName: '',
    maker: '',
  })

  const successSubmit = (pro: ProductType) => {
    product.value = pro
    registrationVisible.value = true
  }

  return {
    registrationVisible,
    product,
    successSubmit,
  }
}
