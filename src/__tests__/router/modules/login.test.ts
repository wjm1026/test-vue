// generated-by: ai v1.0
// type: unit
// description: Unit test for login routes module, validating route configuration structure and properties.

import { describe, it, expect } from 'vitest'

import { loginRoutes } from '@/router/modules/login'
import { routePaths } from '@/router/paths'
import { routeNames } from '@/router/names'
import { UserRoleEnum } from '@/enum'

describe('login routes module', () => {
  it('should export an array of route records', () => {
    expect(Array.isArray(loginRoutes)).toBe(true)
    expect(loginRoutes.length).toBe(3)
  })

  it('should have correct structure for forget password route', () => {
    const forgetPasswordRoute = loginRoutes[0]
    expect(forgetPasswordRoute.path).toBe(routePaths.forgetPassword)
    expect(forgetPasswordRoute.name).toBe(routeNames.forgetPassword)
    expect(forgetPasswordRoute.meta).toBeDefined()
    expect(forgetPasswordRoute.meta?.menu).toBe('パスワードをお忘れの場合')
    expect(forgetPasswordRoute.meta?.sidebar).toBe(false)
    expect(typeof forgetPasswordRoute.component).toBe('function')
  })

  it('should have correct structure for reset password route', () => {
    const resetPasswordRoute = loginRoutes[1]
    expect(resetPasswordRoute.path).toBe(routePaths.resetPassword)
    expect(resetPasswordRoute.name).toBe(routeNames.resetPassword)
    expect(resetPasswordRoute.meta).toBeDefined()
    expect(resetPasswordRoute.meta?.menu).toBe('パスワードの再設定')
    expect(resetPasswordRoute.meta?.sidebar).toBe(false)
    expect(typeof resetPasswordRoute.component).toBe('function')
  })

  it('should have correct structure for login route', () => {
    const loginRoute = loginRoutes[2]
    expect(loginRoute.path).toBe(routePaths.login)
    expect(loginRoute.name).toBe(routeNames.login)
    expect(loginRoute.meta).toBeDefined()
    expect(loginRoute.meta?.menu).toBe('ログアウト')
    expect(loginRoute.meta?.sidebar).toBe(true)
    expect(loginRoute.meta?.highlight).toBe(true)
    expect(loginRoute.meta?.viewableRoles).toEqual([
      UserRoleEnum.RepresentativeAdmin,
      UserRoleEnum.GeneralUser,
      UserRoleEnum.ManagementUser,
    ])
    expect(loginRoute.meta?.icon).toBeDefined()
    expect(typeof loginRoute.component).toBe('function')
  })

  it('should have all routes as RouteRecordRaw type', () => {
    loginRoutes.forEach((route) => {
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('name')
      expect(route).toHaveProperty('component')
    })
  })

  it('should expose lazy-loaded component factories (return Promise)', () => {
    const forgetPasswordRoute = loginRoutes[0]
    const resetPasswordRoute = loginRoutes[1]
    const loginRoute = loginRoutes[2]

    const forgetPasswordPromise = (forgetPasswordRoute.component as () => Promise<unknown>)()
    const resetPasswordPromise = (resetPasswordRoute.component as () => Promise<unknown>)()
    const loginPromise = (loginRoute.component as () => Promise<unknown>)()

    expect(forgetPasswordPromise).toBeInstanceOf(Promise)
    expect(resetPasswordPromise).toBeInstanceOf(Promise)
    expect(loginPromise).toBeInstanceOf(Promise)
  })
})
