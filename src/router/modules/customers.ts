import type { RouteRecordRaw } from 'vue-router'

import { routePaths } from '../paths'
import { routeNames } from '../names'

import { UserRoleEnum } from '@/enum'

const CustomersPage = () => import('@/views/customers/CustomersPage.vue')
const CustomerDetailPage = () => import('@/views/customers/CustomerDetailPage.vue')

const viewableRoles = [UserRoleEnum.RepresentativeAdmin, UserRoleEnum.ManagementUser]

export const customersRoutes: RouteRecordRaw[] = [
  {
    path: routePaths.customers.root,
    name: routeNames.customers.root,
    meta: {
      menu: '顧客管理',
      sidebar: true,
      viewableRoles,
    },
    component: CustomersPage,
  },
  {
    path: routePaths.customers.detail,
    name: routeNames.customers.detail,
    meta: { viewableRoles },
    component: CustomerDetailPage,
  },
]
