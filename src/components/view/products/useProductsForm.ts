import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type {
  CategoryType,
  ProductCategoryResponse,
  ProductForm,
  ProductsDetailType,
  ProductType,
} from '@/api/types/products'
import { ProductUsedFlag , pattern } from '@/enum'
import { useProductApi } from '@/hooks/useProductApi'
import { useProductsDetailApi } from '@/hooks/useProductsDetailApi'
import { urlToFile } from '@/util/form-data-helper'
import { camelToSnake } from '@/util/camel-case'
import { useProductCategoryApi } from '@/hooks/useProductCategoryApi'
import message from '@/enum/message.json'

export const useProductsForm = (emit: (event: 'successSubmit', product: ProductType) => void) => {
  const route = useRoute()
  const router = useRouter()

  const routeJanCode = computed(() => (route.params?.id as string) ?? '')
  const productImageUrl = ref('')
  const id = ref<number>()
  const isUsed = ref(false)
  const { productCategory, isFetching: isCategoryFetching } = useProductCategoryApi()
  const productDetail = useProductsDetailApi(routeJanCode)

  const form = reactive<ProductForm>({
    productName: '',
    maker: '',
    janCode: '',
    productCategory: null,
    productImage: undefined,
    description: '',
    other: '',
  })

  watch(
    () => [productCategory.value, productDetail?.productDetail?.value] as const,
    async ([category, data]) => {
      if (!category?.categories?.length || !data) return

      const validCategory: ProductCategoryResponse = category
      const validData: ProductsDetailType = data

      id.value = validData.productId
      isUsed.value = validData.usedFlag === ProductUsedFlag.Used
      form.other = validData.other ?? ''
      form.productName = validData.productName ?? ''
      form.maker = validData.maker ?? ''
      form.janCode = validData.janCode ?? ''
      form.description = validData.description ?? ''
      productImageUrl.value = validData.productImage ?? ''

      const matched = validCategory.categories.find(
        (item: CategoryType) => item.categoryName === validData.categoryName,
      )
      if (matched) {
        form.productCategory = matched.categoryId
      }

      if (validData.productImage) {
        const imageFile = await urlToFile(validData.productImage)
        if (imageFile) {
          form.productImage = imageFile
        }
      }
    },
    {
      immediate: true,
    },
  )

  const productsFormRef = ref<FormInstance>()

  const rules = reactive<FormRules<ProductForm>>({
    productName: [
      { required: true, message: message.product.productNameRequired, trigger: 'blur' },
    ],
    maker: [{ required: true, message: message.product.makerRequired, trigger: 'blur' }],
    janCode: [
      { required: true, message: message.product.janCodeRequired, trigger: 'blur' },
      {
        pattern: pattern.janCode,
        message: message.product.janCodePattern,
        trigger: ['blur', 'change'],
      },
    ],
    productCategory: [
      { required: true, message: message.product.productCategoryRequired, trigger: 'blur' },
    ],
  })

  const disabled = computed(
    () => !form.productName || !form.maker || !form.janCode || !form.productCategory,
  )

  const { submitProduct, isPending: isSubmitProductPending } = useProductApi()

  const handleChange = (uploadFile: UploadFile) => {
    const rawFile = uploadFile.raw
    if (!rawFile) return
    form.productImage = rawFile
    const reader = new FileReader()
    reader.onload = (event) => {
      productImageUrl.value = event.target?.result as string
    }
    reader.readAsDataURL(rawFile)
  }

  const handleRemove = () => {
    form.productImage = undefined
    productImageUrl.value = ''
  }

  const formSubmit = async () => {
    if (!productsFormRef.value) return
    await productsFormRef.value.validate(async (valid) => {
      if (!valid) return
      const data =
        id.value !== undefined && id.value !== null
          ? {
              ...form,
              productId: id.value,
            }
          : form
      const product = await submitProduct(camelToSnake(data))
      emit('successSubmit', product)
    })
  }

  const handleCancel = () => {
    router.go(-1)
  }

  return {
    productsFormRef,
    form,
    rules,
    disabled,
    productImageUrl,
    isSubmitProductPending,
    productCategory,
    isPending: productDetail?.isFetching || isCategoryFetching,
    isUsed,
    handleChange,
    handleRemove,
    formSubmit,
    handleCancel,
  }
}
