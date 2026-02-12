import type { RouteRecordRaw } from 'vue-router'

import { routePaths } from '../paths'
import { routeNames } from '../names'

import LogoutIcon from '@/components/icon/LogoutIcon.vue'
import { UserRoleEnum } from '@/enum'

const LoginPage = () => import('@/views/login/LoginPage.vue')
const ForgetPasswordPage = () => import('@/views/login/ForgotPasswordPage.vue')
const ResetPasswordPage = () => import('@/views/login/ResetPasswordPage.vue')

export const loginRoutes: RouteRecordRaw[] = [
  {
    path: routePaths.forgetPassword,
    name: routeNames.forgetPassword,
    meta: {
      menu: 'パスワードをお忘れの場合',
      sidebar: false,
    },
    component: ForgetPasswordPage,
  },
  {
    path: routePaths.resetPassword,
    name: routeNames.resetPassword,
    meta: {
      menu: 'パスワードの再設定',
      sidebar: false,
    },
    component: ResetPasswordPage,
  },
  {
    path: routePaths.login,
    name: routeNames.login,
    meta: {
      menu: 'ログアウト',
      sidebar: true,
      highlight: true,
      viewableRoles: [
        UserRoleEnum.RepresentativeAdmin,
        UserRoleEnum.GeneralUser,
        UserRoleEnum.ManagementUser,
      ],
      icon: LogoutIcon,
    },
    component: LoginPage,
  },
]
