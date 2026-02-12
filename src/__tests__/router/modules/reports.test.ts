// generated-by: ai v1.0
// type: unit
// description: Unit test for reports routes module, validating route configuration structure and properties.

import { describe, it, expect } from 'vitest'

import { reportsRoutes } from '@/router/modules/reports'
import { routePaths } from '@/router/paths'
import { routeNames } from '@/router/names'
import { UserRoleEnum } from '@/enum'

describe('reports routes module', () => {
  it('should export an array of route records', () => {
    expect(Array.isArray(reportsRoutes)).toBe(true)
    expect(reportsRoutes.length).toBe(2)
  })

  it('should have correct structure for root route', () => {
    const rootRoute = reportsRoutes[0]
    expect(rootRoute.path).toBe(routePaths.reports.root)
    expect(rootRoute.name).toBe(routeNames.reports.root)
    expect(rootRoute.meta).toBeDefined()
    expect(rootRoute.meta?.menu).toBe('調査レポート')
    expect(rootRoute.meta?.sidebar).toBe(true)
    expect(rootRoute.meta?.viewableRoles).toEqual([
      UserRoleEnum.RepresentativeAdmin,
      UserRoleEnum.ManagementUser,
      UserRoleEnum.GeneralUser,
    ])
    expect(typeof rootRoute.component).toBe('function')
  })

  it('should have correct structure for detail route', () => {
    const detailRoute = reportsRoutes[1]
    expect(detailRoute.path).toBe(routePaths.reports.detail)
    expect(detailRoute.name).toBe(routeNames.reports.detail)
    expect(typeof detailRoute.component).toBe('function')
  })

  it('should have all routes as RouteRecordRaw type', () => {
    reportsRoutes.forEach((route) => {
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('name')
      expect(route).toHaveProperty('component')
    })
  })

  it('should expose lazy-loaded component factories (return Promise)', () => {
    const rootRoute = reportsRoutes[0]
    const detailRoute = reportsRoutes[1]

    const rootPromise = (rootRoute.component as () => Promise<unknown>)()
    const detailPromise = (detailRoute.component as () => Promise<unknown>)()

    expect(rootPromise).toBeInstanceOf(Promise)
    expect(detailPromise).toBeInstanceOf(Promise)
  })
})
