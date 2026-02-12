import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'

import { setupRouterGuards } from '@/router/guards'
import { routes, routePaths } from '@/router/routes'
import { useAuthStore } from '@/stores/auth'
import { UserRoleEnum } from '@/enum'

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(() => ({ role: UserRoleEnum.RepresentativeAdmin })),
}))

describe('Router Guards', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    setActivePinia(createPinia())
    router = createRouter({
      history: createMemoryHistory(),
      routes,
    })
    setupRouterGuards(router)
  })

  describe('Authentication Guard', () => {
    it('allows access to public routes without authentication', async () => {
      const authStore = useAuthStore()
      authStore.clearAuth()

      await router.push(routePaths.login)
      await router.isReady()

      expect(router.currentRoute.value.path).toBe(routePaths.login)
    })

    it('redirects to login when accessing protected route without token', async () => {
      const authStore = useAuthStore()
      authStore.clearAuth()

      await router.push(routePaths.projects.root)
      await router.isReady()

      expect(router.currentRoute.value.path).toBe(routePaths.login)
    })

    it('allows access to protected routes with valid token', async () => {
      const authStore = useAuthStore()

      authStore.setToken('valid-token')
      authStore.role = UserRoleEnum.RepresentativeAdmin

      await router.push(routePaths.projects.root)
      await router.isReady()

      expect(router.currentRoute.value.path).toBe(routePaths.projects.root)
    })
  })

  describe('Permission Guard', () => {
    beforeEach(() => {
      const authStore = useAuthStore()
      authStore.setToken('valid-token')
    })

    it('allows RepresentativeAdmin to access all routes', async () => {
      const authStore = useAuthStore()
      authStore.role = UserRoleEnum.RepresentativeAdmin

      // Test projects route
      await router.push(routePaths.projects.root)
      await router.isReady()
      expect(router.currentRoute.value.path).toBe(routePaths.projects.root)

      // Test accounts route (RepresentativeAdmin only)
      await router.push(routePaths.accounts.root)
      await router.isReady()
      expect(router.currentRoute.value.path).toBe(routePaths.accounts.root)
    })

    it('redirects ManagementUser from RepresentativeAdmin-only routes', async () => {
      const authStore = useAuthStore()
      authStore.role = UserRoleEnum.ManagementUser

      // Try to access accounts (RepresentativeAdmin only)
      await router.push(routePaths.accounts.root)
      await router.isReady()

      // Should redirect to first accessible route (projects)
      expect(router.currentRoute.value.path).toBe(routePaths.projects.root)
    })

    it('allows ManagementUser to access permitted routes', async () => {
      const authStore = useAuthStore()
      authStore.role = UserRoleEnum.ManagementUser

      // Test projects route
      await router.push(routePaths.projects.root)
      await router.isReady()
      expect(router.currentRoute.value.path).toBe(routePaths.projects.root)

      // Test products route
      await router.push(routePaths.products.root)
      await router.isReady()
      expect(router.currentRoute.value.path).toBe(routePaths.products.root)
    })

    it('allows GeneralUser to access reports', async () => {
      const authStore = useAuthStore()
      authStore.role = UserRoleEnum.GeneralUser

      await router.push(routePaths.reports.root)
      await router.isReady()
      expect(router.currentRoute.value.path).toBe(routePaths.reports.root)
    })

    it('redirects GeneralUser from restricted routes to first accessible route', async () => {
      const authStore = useAuthStore()
      authStore.role = UserRoleEnum.GeneralUser

      // Try to access projects (not allowed for GeneralUser)
      await router.push(routePaths.projects.root)
      await router.isReady()

      // Should redirect to first accessible route (reports)
      expect(router.currentRoute.value.path).toBe(routePaths.reports.root)
    })
  })

  describe('Route Meta Title', () => {
    it('sets document title from route meta', async () => {
      const authStore = useAuthStore()

      authStore.setToken('valid-token')
      authStore.role = UserRoleEnum.RepresentativeAdmin

      const titleSpy = vi.spyOn(document, 'title', 'set')

      // Navigate to a route with title in meta
      const routeWithTitle = routes.find((r) => r.meta?.title)
      if (routeWithTitle) {
        await router.push(routeWithTitle.path)
        await router.isReady()

        expect(titleSpy).toHaveBeenCalledWith(routeWithTitle.meta?.title)
      }
    })
  })
})
