import type { RouteRecordRaw } from 'vue-router'

import { routePaths } from '../paths'
import { routeNames } from '../names'

import { UserRoleEnum } from '@/enum'

const ReportsPage = () => import('@/views/reports/ReportsPage.vue')
const ReportsDetailPage = () => import('@/views/reports/detail/ReportsDetailPage.vue')

const viewableRoles = [
  UserRoleEnum.RepresentativeAdmin,
  UserRoleEnum.ManagementUser,
  UserRoleEnum.GeneralUser,
]

export const reportsRoutes: RouteRecordRaw[] = [
  {
    path: routePaths.reports.root,
    name: routeNames.reports.root,
    meta: {
      menu: '調査レポート',
      sidebar: true,
      viewableRoles,
    },
    component: ReportsPage,
  },
  {
    path: routePaths.reports.detail,
    name: routeNames.reports.detail,
    meta: { viewableRoles },
    component: ReportsDetailPage,
  },
]
