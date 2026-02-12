import type { RouteRecordRaw } from 'vue-router'

import { routePaths } from '../paths'
import { routeNames } from '../names'

import { UserRoleEnum } from '@/enum'

const CommentsPage = () => import('@/views/comments/CommentsPage.vue')
const CommentDetailPage = () => import('@/views/comments/CommentDetailPage.vue')

const viewableRoles = [UserRoleEnum.RepresentativeAdmin, UserRoleEnum.ManagementUser]

export const commentsRoutes: RouteRecordRaw[] = [
  {
    path: routePaths.comments.root,
    name: routeNames.comments.root,
    meta: {
      menu: 'コメント管理',
      sidebar: true,
      viewableRoles,
    },
    component: CommentsPage,
  },
  {
    path: routePaths.comments.detail,
    name: routeNames.comments.detail,
    meta: { viewableRoles },
    component: CommentDetailPage,
  },
]
