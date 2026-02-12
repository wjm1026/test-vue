import type { RouteRecordRaw } from 'vue-router'

import { routePaths } from '../paths'
import { routeNames } from '../names'

import { UserRoleEnum } from '@/enum'

const AccountsPage = () => import('@/views/accounts/AccountsPage.vue')
const AccountDetailPage = () => import('@/views/accounts/detail/AccountDetailPage.vue')
const AccountCreatePage = () => import('@/views/accounts/create/AccountCreatePage.vue')

const viewableRoles = [UserRoleEnum.RepresentativeAdmin]

export const accountsRoutes: RouteRecordRaw[] = [
  {
    path: routePaths.accounts.root,
    name: routeNames.accounts.root,
    meta: {
      menu: 'アカウント管理',
      sidebar: true,
      viewableRoles,
    },
    component: AccountsPage,
  },
  {
    path: routePaths.accounts.detail,
    name: routeNames.accounts.detail,
    meta: { viewableRoles },
    component: AccountDetailPage,
  },
  {
    path: routePaths.accounts.create,
    name: routeNames.accounts.create,
    meta: { viewableRoles },
    component: AccountCreatePage,
  },
]
