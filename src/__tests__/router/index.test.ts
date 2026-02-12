import { beforeEach, describe, expect, it, vi } from 'vitest'

const createRouterMock = vi.fn()
const createWebHistoryMock = vi.fn()
const setupRouterGuardsMock = vi.fn()

vi.mock('vue-router', () => ({
  createRouter: createRouterMock,
  createWebHistory: createWebHistoryMock,
}))

vi.mock('@/router/guards', () => ({
  setupRouterGuards: setupRouterGuardsMock,
}))

describe('router/index', () => {
  beforeEach(() => {
    vi.resetModules()
    createRouterMock.mockReset()
    createWebHistoryMock.mockReset()
    setupRouterGuardsMock.mockReset()
  })

  // Validates that the router instance is created with the application's routes and base URL.
  it('creates a Vue Router instance with configured routes and history', async () => {
    const routerStub = { beforeEach: vi.fn(), afterEach: vi.fn() }
    const historyStub = Symbol('history')

    createRouterMock.mockReturnValue(routerStub)
    createWebHistoryMock.mockReturnValue(historyStub)

    const { routes } = await import('@/router/routes')
    const routerModule = await import('@/router/index')

    expect(createWebHistoryMock).toHaveBeenCalledWith()
    expect(createRouterMock).toHaveBeenCalledWith({
      history: historyStub,
      routes,
    })
    expect(routerModule.default).toBe(routerStub)
  })

  // Ensures setupRouterGuards is wired with the created router to install route guards.
  it('applies router guards to the created router instance', async () => {
    const routerStub = { beforeEach: vi.fn(), afterEach: vi.fn() }

    createRouterMock.mockReturnValue(routerStub)
    createWebHistoryMock.mockReturnValue(Symbol('history'))

    await import('@/router/index')

    expect(setupRouterGuardsMock).toHaveBeenCalledTimes(1)
    expect(setupRouterGuardsMock).toHaveBeenCalledWith(routerStub)
  })
})
