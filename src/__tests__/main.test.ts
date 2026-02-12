import { beforeEach, describe, expect, it, vi } from 'vitest'

const createAppMock = vi.hoisted(() => vi.fn())
const createPiniaMock = vi.hoisted(() => vi.fn())
const piniaPersistStub = vi.hoisted(() => vi.fn())
const vueQueryPluginStub = vi.hoisted(() => Symbol('VueQueryPlugin'))
const routerStub = vi.hoisted(() => Symbol('Router'))
const appComponentStub = vi.hoisted(() => Symbol('AppComponent'))

vi.mock('vue', () => ({
  createApp: createAppMock,
}))

vi.mock('pinia', () => ({
  createPinia: createPiniaMock,
}))

vi.mock('pinia-plugin-persistedstate', () => ({
  default: piniaPersistStub,
}))

const QueryClientMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  VueQueryPlugin: vueQueryPluginStub,
  QueryClient: QueryClientMock,
}))

vi.mock('element-plus/es/components/message/style/css', () => ({}))

vi.mock('@/style/tailwindcss.css', () => ({}))

vi.mock('@/router', () => ({
  default: routerStub,
}))

vi.mock('@/App.vue', () => ({
  default: appComponentStub,
}))

describe('main.ts', () => {
  beforeEach(() => {
    vi.resetModules()
    createAppMock.mockReset()
    createPiniaMock.mockReset()
    piniaPersistStub.mockReset()
  })

  it('bootstraps Vue with configured plugins and mounts the application', async () => {
    // Confirms main.ts wires Pinia, router, Vue Query plugin, and mount target.
    const pluginOrder: unknown[] = []
    const pluginOptions: unknown[] = []

    const appUseMock = vi.fn((plugin: unknown, options?: unknown) => {
      pluginOrder.push(plugin)
      if (options !== undefined) {
        pluginOptions.push(options)
      }
      return appStub
    })
    const appMountMock = vi.fn()
    const appStub = {
      use: appUseMock,
      mount: appMountMock,
    }

    const piniaUseMock = vi.fn()
    const piniaStub = {
      use: piniaUseMock,
    }

    const queryClientInstance = { queryClient: true }
    QueryClientMock.mockReturnValue(queryClientInstance)

    createAppMock.mockReturnValue(appStub as never)
    createPiniaMock.mockReturnValue(piniaStub as never)

    await import('@/main')

    expect(createAppMock).toHaveBeenCalledTimes(1)
    expect(createAppMock).toHaveBeenCalledWith(appComponentStub)
    expect(createPiniaMock).toHaveBeenCalledTimes(1)

    expect(piniaUseMock).toHaveBeenCalledTimes(1)
    expect(piniaUseMock).toHaveBeenCalledWith(piniaPersistStub)

    expect(QueryClientMock).toHaveBeenCalledTimes(1)
    expect(QueryClientMock).toHaveBeenCalledWith({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
        mutations: {
          retry: false,
        },
      },
    })

    expect(appUseMock).toHaveBeenCalledTimes(3)
    expect(pluginOrder[0]).toBe(piniaStub)
    expect(pluginOrder[1]).toBe(routerStub)
    expect(pluginOrder[2]).toBe(vueQueryPluginStub)
    expect(pluginOptions).toHaveLength(1)
    expect(pluginOptions[0]).toEqual({ queryClient: queryClientInstance })

    expect(appMountMock).toHaveBeenCalledTimes(1)
    expect(appMountMock).toHaveBeenCalledWith('#app')
  })
})
