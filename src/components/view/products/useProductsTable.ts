import router from '@/router'
import { routeNames } from '@/router/routes'

export const useProductsTable = () => {
  const productDetailHandle = (id: string) => {
    router.push({
      name: routeNames.products.detail,
      params: { id },
    })
  }
  return {
    productDetailHandle,
  }
}
