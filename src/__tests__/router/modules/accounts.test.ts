// generated-by: ai v1.0
// type: unit
// description: Unit test for accounts routes module, validating route configuration structure and properties.

import { describe, it, expect } from 'vitest'

import { accountsRoutes } from '@/router/modules/accounts'
import { routePaths } from '@/router/paths'
import { routeNames } from '@/router/names'
import { UserRoleEnum } from '@/enum'

describe('accounts routes module', () => {
  it('should export an array of route records', () => {
    expect(Array.isArray(accountsRoutes)).toBe(true)
    expect(accountsRoutes.length).toBe(3)
  })

  it('should have correct structure for root route', () => {
    const rootRoute = accountsRoutes[0]
    expect(rootRoute.path).toBe(routePaths.accounts.root)
    expect(rootRoute.name).toBe(routeNames.accounts.root)
    expect(rootRoute.meta).toBeDefined()
    expect(rootRoute.meta?.menu).toBe('アカウント管理')
    expect(rootRoute.meta?.sidebar).toBe(true)
    expect(rootRoute.meta?.viewableRoles).toEqual([UserRoleEnum.RepresentativeAdmin])
    expect(typeof rootRoute.component).toBe('function')
  })

  it('should have correct structure for detail route', () => {
    const detailRoute = accountsRoutes[1]
    expect(detailRoute.path).toBe(routePaths.accounts.detail)
    expect(detailRoute.name).toBe(routeNames.accounts.detail)
    expect(typeof detailRoute.component).toBe('function')
  })

  it('should have correct structure for create route', () => {
    const createRoute = accountsRoutes[2]
    expect(createRoute.path).toBe(routePaths.accounts.create)
    expect(createRoute.name).toBe(routeNames.accounts.create)
    expect(typeof createRoute.component).toBe('function')
  })

  it('should have all routes as RouteRecordRaw type', () => {
    accountsRoutes.forEach((route) => {
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('name')
      expect(route).toHaveProperty('component')
    })
  })

  it('should expose lazy-loaded component factories (return Promise)', () => {
    const rootRoute = accountsRoutes[0]
    const detailRoute = accountsRoutes[1]
    const createRoute = accountsRoutes[2]

    const rootPromise = (rootRoute.component as () => Promise<unknown>)()
    const detailPromise = (detailRoute.component as () => Promise<unknown>)()
    const createPromise = (createRoute.component as () => Promise<unknown>)()

    expect(rootPromise).toBeInstanceOf(Promise)
    expect(detailPromise).toBeInstanceOf(Promise)
    expect(createPromise).toBeInstanceOf(Promise)
  })
})
