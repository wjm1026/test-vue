// generated-by: ai v1.0
// type: unit
// description: Unit test for comments routes module, validating route configuration structure and properties.

import { describe, it, expect } from 'vitest'

import { commentsRoutes } from '@/router/modules/comments'
import { routePaths } from '@/router/paths'
import { routeNames } from '@/router/names'
import { UserRoleEnum } from '@/enum'

describe('comments routes module', () => {
  it('should export an array of route records', () => {
    expect(Array.isArray(commentsRoutes)).toBe(true)
    expect(commentsRoutes.length).toBe(2)
  })

  it('should have correct structure for root route', () => {
    const rootRoute = commentsRoutes[0]
    expect(rootRoute.path).toBe(routePaths.comments.root)
    expect(rootRoute.name).toBe(routeNames.comments.root)
    expect(rootRoute.meta).toBeDefined()
    expect(rootRoute.meta?.menu).toBe('コメント管理')
    expect(rootRoute.meta?.sidebar).toBe(true)
    expect(rootRoute.meta?.viewableRoles).toEqual([
      UserRoleEnum.RepresentativeAdmin,
      UserRoleEnum.ManagementUser,
    ])
    expect(typeof rootRoute.component).toBe('function')
  })

  it('should have correct structure for detail route', () => {
    const detailRoute = commentsRoutes[1]
    expect(detailRoute.path).toBe(routePaths.comments.detail)
    expect(detailRoute.name).toBe(routeNames.comments.detail)
    expect(typeof detailRoute.component).toBe('function')
  })

  it('should have all routes as RouteRecordRaw type', () => {
    commentsRoutes.forEach((route) => {
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('name')
      expect(route).toHaveProperty('component')
    })
  })

  it('should expose lazy-loaded component factories (return Promise)', () => {
    const rootRoute = commentsRoutes[0]
    const detailRoute = commentsRoutes[1]

    const rootPromise = (rootRoute.component as () => Promise<unknown>)()
    const detailPromise = (detailRoute.component as () => Promise<unknown>)()

    expect(rootPromise).toBeInstanceOf(Promise)
    expect(detailPromise).toBeInstanceOf(Promise)
  })
})
