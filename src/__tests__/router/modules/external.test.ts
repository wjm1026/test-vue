// generated-by: ai v1.0
// type: unit
// description: Unit test for external routes module, validating route configuration structure, properties, and beforeEnter hook.

import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest'

import { externalRoutes } from '@/router/modules/external'
import { routePaths } from '@/router/paths'
import { routeNames } from '@/router/names'
import { UserRoleEnum } from '@/enum'

describe('external routes module', () => {
  let windowOpenSpy: MockInstance

  beforeEach(() => {
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
  })

  afterEach(() => {
    windowOpenSpy.mockRestore()
  })

  it('should export an array of route records', () => {
    expect(Array.isArray(externalRoutes)).toBe(true)
    expect(externalRoutes.length).toBe(1)
  })

  it('should have correct structure for support route', () => {
    const supportRoute = externalRoutes[0]
    expect(supportRoute.path).toBe(routePaths.external.support)
    expect(supportRoute.name).toBe(routeNames.external.support)
    expect(supportRoute.meta).toBeDefined()
    expect(supportRoute.meta?.menu).toBe('サポート')
    expect(supportRoute.meta?.sidebar).toBe(true)
    expect(supportRoute.meta?.highlight).toBe(true)
    expect(supportRoute.meta?.viewableRoles).toEqual([
      UserRoleEnum.RepresentativeAdmin,
      UserRoleEnum.ManagementUser,
      UserRoleEnum.GeneralUser,
    ])
    expect(supportRoute.meta?.icon).toBeDefined()
    expect(supportRoute.component).toBeDefined()
    expect(typeof supportRoute.beforeEnter).toBe('function')
  })

  it('should have beforeEnter hook that opens external link', () => {
    const supportRoute = externalRoutes[0]
    const beforeEnter = supportRoute.beforeEnter as () => boolean | void

    const result = beforeEnter()

    expect(windowOpenSpy).toHaveBeenCalledTimes(1)
    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining('figma.com'),
      '_blank',
      'noopener,noreferrer',
    )
    expect(result).toBe(false)
  })

  it('should have all routes as RouteRecordRaw type', () => {
    externalRoutes.forEach((route) => {
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('name')
      expect(route).toHaveProperty('component')
    })
  })
})
