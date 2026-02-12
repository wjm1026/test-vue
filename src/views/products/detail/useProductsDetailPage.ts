import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useProductsDetailApi } from '@/hooks/useProductsDetailApi'
import { useProductDeleteApi } from '@/hooks/useProductDeleteApi'
import { ProductUsedFlag, ResultCodeEnum } from '@/enum'
import { routeNames, routePaths } from '@/router/routes'
import message from '@/enum/message.json'

export const useProductsDetailPage = () => {
  const route = useRoute()
  const janCode = computed(() => route.params.id as string)

  const { productDetail, isFetching } = useProductsDetailApi(janCode)

  if (!productDetail)
    return {
      productDetail: null,
      imageUrl: '',
      summary: [],
      detail: [],
      isFetching: false,
      isEmpty: true,
      isDeleteLoading: false,
    }

  const productId = computed(() => productDetail.value?.productId)
  const { deleteProductMutateAsync, isDeleteLoading } = useProductDeleteApi()

  const isEmpty = computed(() => {
    return !isFetching.value && !productDetail.value
  })

  const canDeleteProduct = computed(() => productDetail.value?.usedFlag === ProductUsedFlag.Unused)

  const router = useRouter()

  const imageUrl = computed(() => productDetail.value?.productImage ?? '')

  const summary = computed(() => {
    const data = productDetail.value
    if (!data) return [] as Array<{ label: string; text: string }>

    return [
      { label: '商品名', text: data?.productName ?? '' },
      { label: 'メーカー', text: data?.maker ?? '' },
      { label: 'JANコード', text: data?.janCode ?? '' },
    ]
  })

  const detail = computed(() => {
    const data = productDetail.value
    if (!data) return [] as Array<{ label: string; text: string }>

    return [{ label: '商品説明', text: data?.description ?? '-' }]
  })

  const updateHandle = () => {
    router.push({
      name: routeNames.products.registration,
      params: {
        id: janCode.value,
      },
    })
  }

  const deleteHandle = async () => {
    const response = await deleteProductMutateAsync(Number(productId.value))
    if (response.resultCode === ResultCodeEnum.Success) {
      ElMessage.success(message.product.deleteSuccess)
      router.push(routePaths.products.root)
    }
  }

  return {
    productDetail,
    imageUrl,
    summary,
    detail,
    isFetching,
    isEmpty,
    isDeleteLoading,
    canDeleteProduct,
    updateHandle,
    deleteHandle,
  }
}
