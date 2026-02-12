// generated-by: ai v1.0
// type: unit
// description: Unit test for not-found route module, validating route configuration structure and properties.

import { describe, it, expect } from 'vitest'

import { notFoundRoute } from '@/router/modules/not-found'

describe('not-found route module', () => {
  it('should export a single route record', () => {
    expect(notFoundRoute).toBeDefined()
    expect(typeof notFoundRoute).toBe('object')
  })

  it('should have correct path pattern for catch-all route', () => {
    expect(notFoundRoute.path).toBe('/:pathMatch(.*)*')
  })

  it('should have correct name', () => {
    expect(notFoundRoute.name).toBe('NotFound')
  })

  it('should have a lazy-loaded component', () => {
    expect(typeof notFoundRoute.component).toBe('function')
  })

  it('should be a RouteRecordRaw type', () => {
    expect(notFoundRoute).toHaveProperty('path')
    expect(notFoundRoute).toHaveProperty('name')
    expect(notFoundRoute).toHaveProperty('component')
  })

  it('should expose lazy-loaded component factory (return Promise)', () => {
    const componentPromise = (notFoundRoute.component as () => Promise<unknown>)()
    expect(componentPromise).toBeInstanceOf(Promise)
  })
})
