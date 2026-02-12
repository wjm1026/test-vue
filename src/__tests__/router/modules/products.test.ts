// generated-by: ai v1.0
// type: unit
// description: Unit test for products routes module, validating route configuration structure and properties.

import { describe, it, expect } from 'vitest'

import { productsRoutes } from '@/router/modules/products'
import { routePaths } from '@/router/paths'
import { routeNames } from '@/router/names'
import { UserRoleEnum } from '@/enum'

describe('products routes module', () => {
  it('should export an array of route records', () => {
    expect(Array.isArray(productsRoutes)).toBe(true)
    expect(productsRoutes.length).toBe(3)
  })

  it('should have correct structure for root route', () => {
    const rootRoute = productsRoutes[0]
    expect(rootRoute.path).toBe(routePaths.products.root)
    expect(rootRoute.name).toBe(routeNames.products.root)
    expect(rootRoute.meta).toBeDefined()
    expect(rootRoute.meta?.menu).toBe('商品管理')
    expect(rootRoute.meta?.sidebar).toBe(true)
    expect(rootRoute.meta?.viewableRoles).toEqual([
      UserRoleEnum.RepresentativeAdmin,
      UserRoleEnum.ManagementUser,
    ])
    expect(typeof rootRoute.component).toBe('function')
  })

  it('should have correct structure for detail route', () => {
    const detailRoute = productsRoutes[1]
    expect(detailRoute.path).toBe(routePaths.products.detail)
    expect(detailRoute.name).toBe(routeNames.products.detail)
    expect(typeof detailRoute.component).toBe('function')
  })

  it('should have correct structure for registration route', () => {
    const registrationRoute = productsRoutes[2]
    expect(registrationRoute.path).toBe(routePaths.products.registration)
    expect(registrationRoute.name).toBe(routeNames.products.registration)
    expect(typeof registrationRoute.component).toBe('function')
  })

  it('should have all routes as RouteRecordRaw type', () => {
    productsRoutes.forEach((route) => {
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('name')
      expect(route).toHaveProperty('component')
    })
  })

  it('should expose lazy-loaded component factories (return Promise)', () => {
    const rootRoute = productsRoutes[0]
    const detailRoute = productsRoutes[1]
    const registrationRoute = productsRoutes[2]

    const rootPromise = (rootRoute.component as () => Promise<unknown>)()
    const detailPromise = (detailRoute.component as () => Promise<unknown>)()
    const registrationPromise = (registrationRoute.component as () => Promise<unknown>)()

    expect(rootPromise).toBeInstanceOf(Promise)
    expect(detailPromise).toBeInstanceOf(Promise)
    expect(registrationPromise).toBeInstanceOf(Promise)
  })
})
