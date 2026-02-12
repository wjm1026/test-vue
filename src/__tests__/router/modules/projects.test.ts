// generated-by: ai v1.0
// type: unit
// description: Unit test for projects routes module, validating route configuration structure and properties.

import { describe, it, expect } from 'vitest'

import { projectsRoutes } from '@/router/modules/projects'
import { routePaths } from '@/router/paths'
import { routeNames } from '@/router/names'
import { UserRoleEnum } from '@/enum'

describe('projects routes module', () => {
  it('should export an array of route records', () => {
    expect(Array.isArray(projectsRoutes)).toBe(true)
    expect(projectsRoutes.length).toBe(3)
  })

  it('should have correct structure for root route', () => {
    const rootRoute = projectsRoutes[0]
    expect(rootRoute.path).toBe(routePaths.projects.root)
    expect(rootRoute.name).toBe(routeNames.projects.root)
    expect(rootRoute.meta).toBeDefined()
    expect(rootRoute.meta?.menu).toBe('プロジェクト管理')
    expect(rootRoute.meta?.sidebar).toBe(true)
    expect(rootRoute.meta?.viewableRoles).toEqual([
      UserRoleEnum.RepresentativeAdmin,
      UserRoleEnum.ManagementUser,
    ])
    expect(typeof rootRoute.component).toBe('function')
  })

  it('should have correct structure for detail route', () => {
    const detailRoute = projectsRoutes[1]
    expect(detailRoute.path).toBe(routePaths.projects.detail)
    expect(detailRoute.name).toBe(routeNames.projects.detail)
    expect(typeof detailRoute.component).toBe('function')
  })

  it('should have correct structure for create route', () => {
    const createRoute = projectsRoutes[2]
    expect(createRoute.path).toBe(routePaths.projects.create)
    expect(createRoute.name).toBe(routeNames.projects.create)
    expect(typeof createRoute.component).toBe('function')
  })

  it('should have all routes as RouteRecordRaw type', () => {
    projectsRoutes.forEach((route) => {
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('name')
      expect(route).toHaveProperty('component')
    })
  })

  it('should expose lazy-loaded component factories (return Promise)', () => {
    const rootRoute = projectsRoutes[0]
    const detailRoute = projectsRoutes[1]
    const createRoute = projectsRoutes[2]

    const rootPromise = (rootRoute.component as () => Promise<unknown>)()
    const detailPromise = (detailRoute.component as () => Promise<unknown>)()
    const createPromise = (createRoute.component as () => Promise<unknown>)()

    expect(rootPromise).toBeInstanceOf(Promise)
    expect(detailPromise).toBeInstanceOf(Promise)
    expect(createPromise).toBeInstanceOf(Promise)
  })
})
