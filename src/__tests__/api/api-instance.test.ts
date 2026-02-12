import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AxiosRequestConfig } from 'axios'

// Narrow types for axios mocks
type SimpleResponse = { data: never; status: number }

const authStoreMock = {
  accessToken: '',
  isTokenValid: false,
  ensureAuth: vi.fn<() => Promise<boolean>>().mockResolvedValue(true),
  initFromCookie: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  refreshOnce: vi.fn<() => Promise<string>>().mockResolvedValue(''),
  clearAuth: vi.fn(),
}

const errorStoreMock = {
  showErrorDialog: false,
  showError: vi.fn(),
  hideError: vi.fn(),
}

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authStoreMock,
}))

vi.mock('@/stores/error', () => ({
  useErrorStore: () => errorStoreMock,
}))

const axiosInstanceMock = vi.fn<(config: AxiosRequestConfig) => Promise<SimpleResponse>>()
type RequestUseFn = (
  ...args: [
    onFulfilled: (c: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
    onRejected?: (e: never) => Promise<never>,
  ]
) => void
type ResponseUseFn = (
  ...args: [
    onFulfilled: (r: SimpleResponse) => SimpleResponse,
    onRejected?: (e: never) => Promise<never>,
  ]
) => void

const requestUseMock = vi.fn<RequestUseFn>()
const responseUseMock = vi.fn<ResponseUseFn>()
let storedRequestHandlers: {
  onFulfilled?: (c: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
  onRejected?: (e: never) => Promise<never>
} = {}
let storedResponseHandlers: {
  onFulfilled?: (r: SimpleResponse) => SimpleResponse
  onRejected?: (e: never) => Promise<never>
} = {}
const cancelFn = vi.fn<(reason?: string) => void>()
const cancelSource = { token: 'mock-cancel-token', cancel: cancelFn }

const routerMock = vi.hoisted(() => ({
  currentRoute: { value: { path: '/projects' } },
  push: vi.fn(),
}))

const elMessageMocks = vi.hoisted(() => ({
  error: vi.fn(),
  success: vi.fn(),
}))

vi.mock('element-plus', () => ({
  ElMessage: elMessageMocks,
}))

vi.mock('@/router', () => ({
  default: routerMock,
}))

vi.mock('@/router/routes', () => ({
  isPublicRoute: (path: string) => path === '/login' || path === '/login/',
  routePaths: { login: '/login' },
}))

// Shape of axios instance returned by axios.create
type AxiosInstanceLike = typeof axiosInstanceMock & {
  interceptors: {
    request: { use: typeof requestUseMock }
    response: { use: typeof responseUseMock }
  }
}

const axiosInstance: AxiosInstanceLike = Object.assign(axiosInstanceMock, {
  interceptors: {
    request: { use: requestUseMock },
    response: { use: responseUseMock },
  },
})

const axiosCreateMock = vi.fn<() => AxiosInstanceLike>(() => axiosInstance)

vi.mock('axios', () => ({
  default: {
    create: axiosCreateMock,
    CancelToken: { source: vi.fn(() => cancelSource) },
    isCancel: vi.fn(() => false),
  },
  create: axiosCreateMock,
  CancelToken: { source: vi.fn(() => cancelSource) },
  isCancel: vi.fn(() => false),
}))

beforeEach(() => {
  vi.resetModules()
  authStoreMock.accessToken = ''
  authStoreMock.isTokenValid = false
  authStoreMock.ensureAuth.mockReset().mockResolvedValue(true)
  authStoreMock.initFromCookie.mockReset().mockResolvedValue(undefined)
  authStoreMock.refreshOnce.mockReset().mockResolvedValue('new-token')
  authStoreMock.clearAuth.mockReset()
  errorStoreMock.showError.mockReset()
  errorStoreMock.hideError.mockReset()
  routerMock.push.mockReset()
  requestUseMock.mockReset()
  responseUseMock.mockReset()
  axiosInstanceMock.mockReset()
  axiosInstanceMock.mockImplementation(() =>
    Promise.resolve({ data: { ok: true } as never, status: 200 }),
  )
  cancelFn.mockReset()
  storedRequestHandlers = {}
  storedResponseHandlers = {}
})

describe('apiInstance', () => {
  const captureInterceptors = async () => {
    requestUseMock.mockImplementationOnce((...args) => {
      const [onFulfilled, onRejected] = args
      storedRequestHandlers = { onFulfilled, onRejected }
    })
    responseUseMock.mockImplementationOnce((...args) => {
      const [onFulfilled, onRejected] = args
      storedResponseHandlers = { onFulfilled, onRejected }
    })
    return import('@/api/api-instance')
  }

  it('returns response data and merges config with options', async () => {
    await captureInterceptors()
    axiosInstanceMock.mockResolvedValueOnce({ data: { ok: true } as never, status: 200 })

    const { apiInstance } = await import('@/api/api-instance')

    const result = await apiInstance<{ ok: boolean }>(
      { url: '/api/test', method: 'GET' },
      { headers: { 'X-Test': '1' } },
    )

    expect(result).toEqual({ ok: true })

    expect(axiosCreateMock).toHaveBeenCalledTimes(1)
    expect(axiosInstanceMock).toHaveBeenCalledTimes(1)

    const passedConfig = axiosInstanceMock.mock.calls[0][0] as AxiosRequestConfig
    expect(passedConfig.url).toBe('/api/test')
    expect(passedConfig.method).toBe('GET')
    expect((passedConfig as { headers?: Record<string, string> }).headers?.['X-Test']).toBe('1')
    expect((passedConfig as { cancelToken?: string }).cancelToken).toBe(cancelSource.token)

    // Exercise request interceptor success path
    const sampleConfig: AxiosRequestConfig = { url: '/x' }
    expect(await storedRequestHandlers.onFulfilled!(sampleConfig)).toBe(sampleConfig)

    // Exercise response interceptor success path
    const sampleResponse: SimpleResponse = { data: 1 as never, status: 200 }
    expect(storedResponseHandlers.onFulfilled!(sampleResponse)).toBe(sampleResponse)
  })

  it('exposes a cancel method that cancels the request', async () => {
    // Keep the promise pending so we can call cancel
    axiosInstanceMock.mockImplementationOnce(() => new Promise(() => {}))

    const { apiInstance } = await import('@/api/api-instance')

    const p = apiInstance<never>({ url: '/api/slow', method: 'GET' }) as Promise<never> & {
      cancel: () => void
    }

    expect(typeof p.cancel).toBe('function')

    p.cancel()
    expect(cancelFn).toHaveBeenCalledWith('Query was cancelled')
  })

  it('propagates errors from axios instance', async () => {
    await captureInterceptors()
    const err = new Error('network')
    axiosInstanceMock.mockRejectedValueOnce(err)

    const { apiInstance } = await import('@/api/api-instance')

    await expect(apiInstance({ url: '/api/fail', method: 'GET' })).rejects.toThrow('network')

    // Exercise request/response interceptor error handlers
    await expect(storedRequestHandlers.onRejected!(err as never)).rejects.toBe(err)
    await expect(storedResponseHandlers.onRejected!(err as never)).rejects.toBe(err)
  })

  it('skips auth guard when skipAuthGuard flag is present', async () => {
    await captureInterceptors()
    const config = { url: '/public', skipAuthGuard: true }

    const result = await storedRequestHandlers.onFulfilled!(config as never)

    expect((result as { skipAuthGuard?: boolean }).skipAuthGuard).toBeUndefined()
    expect(authStoreMock.ensureAuth).not.toHaveBeenCalled()
  })

  it('redirects to login when authentication fails', async () => {
    routerMock.currentRoute.value.path = '/projects'
    authStoreMock.ensureAuth.mockResolvedValueOnce(false)
    await captureInterceptors()
    const config = { url: '/secure' }

    await expect(storedRequestHandlers.onFulfilled!(config as never)).rejects.toThrow(
      'リフレッシュトークンが無効です',
    )

    expect(authStoreMock.clearAuth).toHaveBeenCalled()
    expect(routerMock.push).toHaveBeenCalledWith('/login')
  })

  it('adds bearer token header when authenticated', async () => {
    authStoreMock.accessToken = 'token-123'
    routerMock.currentRoute.value.path = '/secure'
    await captureInterceptors()
    const config = { url: '/secure', headers: {} }

    const result = await storedRequestHandlers.onFulfilled!(config as never)

    expect(result.headers?.Authorization).toBe('Bearer token-123')
  })

  it('retries unauthorized response by refreshing token', async () => {
    await captureInterceptors()
    const error = {
      config: { url: '/data', headers: {} as Record<string, string> } as AxiosRequestConfig & {
        _retry?: boolean
      },
      response: { status: 401 },
    }

    axiosInstanceMock.mockResolvedValueOnce({ data: { ok: true } as never, status: 200 })

    const result = await storedResponseHandlers.onRejected!(error as never)

    expect(authStoreMock.refreshOnce).toHaveBeenCalledTimes(1)
    expect(error.config._retry).toBe(true)
    expect(error.config.headers?.Authorization).toBe('Bearer new-token')
    expect(result).toEqual({ data: { ok: true }, status: 200 })
  })

  it('clears auth and redirects when refresh fails', async () => {
    authStoreMock.accessToken = 'stale-token'
    authStoreMock.refreshOnce.mockRejectedValueOnce(new Error('refresh failed'))
    await captureInterceptors()
    const error = {
      config: { url: '/data', headers: {} as Record<string, string> },
      response: { status: 401 },
    }

    await expect(storedResponseHandlers.onRejected!(error as never)).rejects.toThrow(
      'refresh failed',
    )

    expect(authStoreMock.clearAuth).toHaveBeenCalled()
    expect(routerMock.push).toHaveBeenCalledWith('/login')
    expect(elMessageMocks.error).toHaveBeenCalledWith(
      'トークンが有効期限切れです。再度ログインしてください。',
    )
  })

  it('shows error dialog on server or network errors', async () => {
    await captureInterceptors()
    const networkError = { code: 'ERR_NETWORK', message: 'offline' }
    await expect(storedResponseHandlers.onRejected!(networkError as never)).rejects.toBe(
      networkError as never,
    )
    expect(errorStoreMock.showError).toHaveBeenCalled()

    errorStoreMock.showError.mockClear()
    const serverError = { response: { status: 500 }, message: 'boom' }
    await expect(storedResponseHandlers.onRejected!(serverError as never)).rejects.toBe(
      serverError as never,
    )
    expect(errorStoreMock.showError).toHaveBeenCalled()
  })

  it('surfaces non-server error messages via ElMessage', async () => {
    await captureInterceptors()
    const error = { response: { status: 400, data: { message: 'bad' } }, message: 'bad' }

    await expect(storedResponseHandlers.onRejected!(error as never)).rejects.toBe(error as never)

    expect(elMessageMocks.error).toHaveBeenCalledWith('bad')
  })

  it('bypasses handling for refresh endpoint and cancellations', async () => {
    await captureInterceptors()
    const refreshError = { config: { url: '/refresh' } }
    await expect(storedResponseHandlers.onRejected!(refreshError as never)).rejects.toBe(
      refreshError as never,
    )

    const axiosModule = await import('axios')
    ;(axiosModule.isCancel as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(true)
    const cancelError = new Error('cancelled')
    await expect(storedResponseHandlers.onRejected!(cancelError as never)).rejects.toThrow(
      'cancelled',
    )
  })
})
