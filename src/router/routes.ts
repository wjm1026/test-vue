import type { RouteRecordRaw } from 'vue-router'

import { routePaths } from './paths'
import {
  accountsRoutes,
  commentsRoutes,
  customersRoutes,
  externalRoutes,
  loginRoutes,
  notFoundRoute,
  productsRoutes,
  projectsRoutes,
  reportsRoutes,
} from './modules'

export { routePaths } from './paths'
export { routeNames } from './names'

export const routes: RouteRecordRaw[] = [
  ...projectsRoutes,
  ...reportsRoutes,
  ...productsRoutes,
  ...customersRoutes,
  ...commentsRoutes,
  ...accountsRoutes,
  ...externalRoutes,
  ...loginRoutes,
  notFoundRoute,
]

const publicRoutes = [
  routePaths.login,
  routePaths.forgetPassword,
  routePaths.resetPassword,
]

export const isPublicRoute = (path: string): boolean => {
  const normalizedPath = path.replace(/\/$/, '') || '/'
  return publicRoutes.includes(normalizedPath)
}
