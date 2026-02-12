import { beforeEach, describe, expect, it, vi } from 'vitest'

const requestSpy = vi.hoisted(() => vi.fn())
const createApiRequestMock = vi.hoisted(() => vi.fn())
const toCamelCaseKeysMock = vi.hoisted(() => vi.fn((value) => ({ __camel: value })))

vi.mock('@/api/request', () => ({
  createApiRequest: createApiRequestMock,
}))

vi.mock('@/util/camel-case', () => ({
  toCamelCaseKeys: toCamelCaseKeysMock,
}))

describe('api/login', () => {
  beforeEach(() => {
    vi.resetModules()
    requestSpy.mockReset().mockResolvedValue('login-response')
    createApiRequestMock.mockReset().mockReturnValue(requestSpy)
    toCamelCaseKeysMock.mockClear()
  })

  it('sets up login request with camelized mock response', async () => {
    await import('@/api/login')

    const loginResponseJson = (await import('@/mocks/data/login/login.json')).default
    const forgetPasswordResponseJson = (await import('@/mocks/data/login/forgetPassword.json'))
      .default
    const resetPasswordResponseJson = (await import('@/mocks/data/login/resetPassword.json'))
      .default

    const refreshTokenResponseJson = (await import('@/mocks/data/login/refreshToken.json')).default

    expect(toCamelCaseKeysMock).toHaveBeenCalledTimes(4)
    expect(toCamelCaseKeysMock).toHaveBeenNthCalledWith(1, loginResponseJson)
    expect(toCamelCaseKeysMock).toHaveBeenNthCalledWith(2, resetPasswordResponseJson)
    expect(toCamelCaseKeysMock).toHaveBeenNthCalledWith(3, forgetPasswordResponseJson)
    expect(toCamelCaseKeysMock).toHaveBeenNthCalledWith(4, refreshTokenResponseJson)
    expect(createApiRequestMock).toHaveBeenNthCalledWith(1, { __camel: loginResponseJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(2, { __camel: resetPasswordResponseJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(3, { __camel: forgetPasswordResponseJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(4, { __camel: refreshTokenResponseJson })
  })

  it('delegates login call to request factory with POST payload', async () => {
    const { login } = await import('@/api/login')

    const payload = { email: 'user@example.test', password: 'secret' }
    const result = await login(payload)

    expect(result).toBe('login-response')
    expect(requestSpy).toHaveBeenCalledTimes(1)
    expect(requestSpy).toHaveBeenCalledWith({
      url: '/login',
      method: 'POST',
      data: payload,
      skipAuthGuard: true,
    })
  })

  it('delegates resetPassword and forgetPassword requests', async () => {
    const { resetPassword, forgetPassword } = await import('@/api/login')

    await resetPassword({ resetToken: 't', newPassword: 'new' })
    await forgetPassword({ email: 'user@example.test' })

    expect(requestSpy).toHaveBeenNthCalledWith(1, {
      url: '/reset',
      method: 'POST',
      data: { resetToken: 't', newPassword: 'new' },
      skipAuthGuard: true,
    })
    expect(requestSpy).toHaveBeenNthCalledWith(2, {
      url: '/reset-request',
      method: 'POST',
      data: { email: 'user@example.test' },
      skipAuthGuard: true,
    })
  })

  it('adds skipAuthGuard when refreshing token', async () => {
    const { refreshToken } = await import('@/api/login')

    await refreshToken()

    expect(requestSpy).toHaveBeenCalledWith({
      url: '/refresh',
      method: 'POST',
      skipAuthGuard: true,
    })
  })
})
