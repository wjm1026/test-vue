// generated-by: ai v1.0
// type: unit
// description: Unit test for customers routes module, validating route configuration structure and properties.

import { describe, it, expect } from 'vitest'

import { customersRoutes } from '@/router/modules/customers'
import { routePaths } from '@/router/paths'
import { routeNames } from '@/router/names'
import { UserRoleEnum } from '@/enum'

describe('customers routes module', () => {
  it('should export an array of route records', () => {
    expect(Array.isArray(customersRoutes)).toBe(true)
    expect(customersRoutes.length).toBe(2)
  })

  it('should have correct structure for root route', () => {
    const rootRoute = customersRoutes[0]
    expect(rootRoute.path).toBe(routePaths.customers.root)
    expect(rootRoute.name).toBe(routeNames.customers.root)
    expect(rootRoute.meta).toBeDefined()
    expect(rootRoute.meta?.menu).toBe('顧客管理')
    expect(rootRoute.meta?.sidebar).toBe(true)
    expect(rootRoute.meta?.viewableRoles).toEqual([
      UserRoleEnum.RepresentativeAdmin,
      UserRoleEnum.ManagementUser,
    ])
    expect(typeof rootRoute.component).toBe('function')
  })

  it('should have correct structure for detail route', () => {
    const detailRoute = customersRoutes[1]
    expect(detailRoute.path).toBe(routePaths.customers.detail)
    expect(detailRoute.name).toBe(routeNames.customers.detail)
    expect(typeof detailRoute.component).toBe('function')
  })

  it('should have all routes as RouteRecordRaw type', () => {
    customersRoutes.forEach((route) => {
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('name')
      expect(route).toHaveProperty('component')
    })
  })

  it('should expose lazy-loaded component factories (return Promise)', () => {
    const rootRoute = customersRoutes[0]
    const detailRoute = customersRoutes[1]

    const rootPromise = (rootRoute.component as () => Promise<unknown>)()
    const detailPromise = (detailRoute.component as () => Promise<unknown>)()

    expect(rootPromise).toBeInstanceOf(Promise)
    expect(detailPromise).toBeInstanceOf(Promise)
  })
})
