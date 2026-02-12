import { ElMessage } from 'element-plus'
import { type Router } from 'vue-router'

import { isPublicRoute, routePaths } from './routes'
import { hasPermission, findFirstAccessibleRoute } from './permission'

import { useAuthStore } from '@/stores/auth'

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, _, next) => {
    const authStore = useAuthStore()
    if (isPublicRoute(to.path)) {
      return next()
    }

    if (!authStore.accessToken) {
      if (!authStore.hasLoginHistory) {
        return next(routePaths.login)
      }

      try {
        await authStore.refreshOnce()
      } catch (error) {
        authStore.clearAuth()
        const msg = error instanceof Error ? error.message : String(error)
        ElMessage.error(msg)
        return next(routePaths.login)
      }
    }

    if (!hasPermission(to, authStore.role)) {
      const firstAccessibleRoute = findFirstAccessibleRoute(authStore.role)
      return next(firstAccessibleRoute)
    }

    return next()
  })

  router.afterEach((to) => {
    if (to.meta?.title) {
      document.title = to.meta.title as string
    }
  })
}
