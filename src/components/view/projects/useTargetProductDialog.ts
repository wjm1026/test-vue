import { computed, ref, watch } from 'vue'
import type { CheckboxValueType } from 'element-plus'

import { SortOrder, defaultPage, pageSize } from '@/enum'
import { useProductListApi } from '@/hooks/useProductListApi'
import { useDebouncedRef } from '@/hooks/useDebouncedRef'
import type { Product } from '@/api/types/products'

export const useTargetProductDialog = (
  props: { modelValue: boolean; janCode: string; product?: Product },
  emit: {
    (event: 'closeTargetProduct'): void
    (event: 'chooseTargetProduct', product: Product): void
  },
) => {
  const searchKeyword = ref<string>('')
  const debouncedQuery = useDebouncedRef(searchKeyword)
  const targetProductVisible = ref(false)
  const isProductSelect = ref(false)
  const page = ref(defaultPage)
  const sortField = ref('')
  const sortOrder = ref<SortOrder>(SortOrder.Asc)
  const offset = computed(() => (page.value - 1) * pageSize)
  const janCode = ref('')
  const targetProduct = ref<Product>()
  const disabled = computed(() => !janCode.value)
  const productData = ref<Product[]>()
  const selectProduct = ref<Product>()
  const pageTotal = ref(0)

  const { productList, isLoading } = useProductListApi(
    {
      offset,
      query: debouncedQuery,
      sortKey: sortField,
      sortOrder: sortOrder,
    },
    page,
  )

  const pageChange = (value: number) => {
    page.value = value
  }

  const handleRadioChange = (code: string) => {
    janCode.value = code
    if (productList.value?.products) {
      const data = productList.value.products
      selectProduct.value = data.filter((item: Product) => item.janCode === janCode.value)[0]
    }
  }

  const handleSetup = () => {
    targetProduct.value = selectProduct.value ?? targetProduct.value
    if (!targetProduct.value) return
    emit('chooseTargetProduct', targetProduct.value)
    handleCancel()
  }

  const handleCancel = () => {
    targetProductVisible.value = false
    emit('closeTargetProduct')
  }

  const changeSelect = (value: CheckboxValueType) => {
    productData.value = value
      ? (targetProduct.value && [targetProduct.value]) || []
      : (productList.value?.products ?? [])
  }

  watch(
    (): [boolean, string, Product | undefined] => [props.modelValue, props.janCode, props?.product],
    ([visible, code, product]) => {
      targetProductVisible.value = visible
      janCode.value = code
      if (product) {
        targetProduct.value = product
      }
    },
    { immediate: true },
  )

  watch(
    () => productList.value,
    (data) => {
      if (!data) return
      const { products, total } = data
      productData.value = products ?? []
      pageTotal.value = total ?? 0
    },
    {
      immediate: true,
    },
  )

  return {
    searchKeyword,
    targetProductVisible,
    productList,
    productData,
    sortField,
    sortOrder,
    janCode,
    disabled,
    isProductSelect,
    isLoading,
    page,
    pageTotal,
    pageChange,
    handleRadioChange,
    handleCancel,
    handleSetup,
    changeSelect,
  }
}
