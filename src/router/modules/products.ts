import type { RouteRecordRaw } from 'vue-router'

import { routePaths } from '../paths'
import { routeNames } from '../names'

import { UserRoleEnum } from '@/enum'

const ProductsPage = () => import('@/views/products/ProductsPage.vue')
const ProductsDetailPage = () => import('@/views/products/detail/ProductsDetailPage.vue')
const ProductsRegistrationPage = () =>
  import('@/views/products/registration/ProductsRegistrationPage.vue')

const viewableRoles = [UserRoleEnum.RepresentativeAdmin, UserRoleEnum.ManagementUser]

export const productsRoutes: RouteRecordRaw[] = [
  {
    path: routePaths.products.root,
    name: routeNames.products.root,
    meta: {
      menu: '商品管理',
      sidebar: true,
      viewableRoles,
    },
    component: ProductsPage,
  },
  {
    path: routePaths.products.detail,
    name: routeNames.products.detail,
    meta: { viewableRoles },
    component: ProductsDetailPage,
  },
  {
    path: routePaths.products.registration,
    name: routeNames.products.registration,
    meta: { viewableRoles },
    component: ProductsRegistrationPage,
  },
]
