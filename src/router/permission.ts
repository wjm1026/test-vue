import type { RouteLocationNormalized } from 'vue-router'

import { routes, routePaths } from './routes'

import type { UserRoleEnum } from '@/enum'

export function hasPermission(route: RouteLocationNormalized, userRole: UserRoleEnum): boolean {
  const viewableRoles = route.meta?.viewableRoles as UserRoleEnum[] | undefined

  if (!viewableRoles || viewableRoles.length === 0) {
    return true
  }

  return viewableRoles.includes(userRole)
}

export function findFirstAccessibleRoute(userRole: UserRoleEnum) {
  const accessibleRoute = routes.find((route) => {
    const viewableRoles = route.meta?.viewableRoles as UserRoleEnum[] | undefined
    return viewableRoles && viewableRoles.includes(userRole)
  })

  return accessibleRoute?.path ?? routePaths.projects.root
}
