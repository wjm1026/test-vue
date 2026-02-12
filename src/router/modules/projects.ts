import type { RouteRecordRaw } from 'vue-router'

import { routePaths } from '../paths'
import { routeNames } from '../names'

import { UserRoleEnum } from '@/enum'

const ProjectsPage = () => import('@/views/projects/ProjectsPage.vue')
const ProjectsDetailPage = () => import('@/views/projects/detail/ProjectsDetailPage.vue')
const ProjectsCreatePage = () => import('@/views/projects/create/ProjectCreatePage.vue')

const viewableRoles = [UserRoleEnum.RepresentativeAdmin, UserRoleEnum.ManagementUser]

export const projectsRoutes: RouteRecordRaw[] = [
  {
    path: routePaths.projects.root,
    name: routeNames.projects.root,
    meta: {
      menu: 'プロジェクト管理',
      sidebar: true,
      viewableRoles,
    },
    component: ProjectsPage,
  },
  {
    path: routePaths.projects.detail,
    name: routeNames.projects.detail,
    meta: { viewableRoles },
    component: ProjectsDetailPage,
  },
  {
    path: routePaths.projects.create,
    name: routeNames.projects.create,
    meta: { viewableRoles },
    component: ProjectsCreatePage,
  },
]
