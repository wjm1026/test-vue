import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { UserRoleEnum } from '@/enum'

const jwtDecodeMock = vi.hoisted(() => vi.fn())

vi.mock('jwt-decode', () => ({
  jwtDecode: jwtDecodeMock,
}))

vi.mock('pinia-plugin-persistedstate', () => ({
  default: vi.fn(() => ({
    plugin: vi.fn(),
  })),
}))

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    jwtDecodeMock.mockReset()
    jwtDecodeMock.mockReturnValue({ role: ['represent'] })
    vi.useRealTimers()
  })

  it('initializes access token as null and defaults expiresAt to null', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const store = useAuthStore()

    expect(store.accessToken).toBeNull()
    expect(store.expiresAt).toBeNull()
  }, 10000)

  it('setToken updates state and persists token, falling back to clearAuth on failure', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const store = useAuthStore()

    store.setToken('new-token')
    expect(store.accessToken).toBe('new-token')
    expect(store.role).toBe(UserRoleEnum.RepresentativeAdmin)
    expect(jwtDecodeMock).toHaveBeenCalledWith('new-token')

    jwtDecodeMock.mockImplementationOnce(() => {
      throw new Error('decode error')
    })
    store.setToken('invalid-token')
    expect(store.accessToken).toBeNull()
    expect(store.expiresAt).toBeNull()
  })

  it('setExpiresAt stores absolute expiry using seconds offset', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000_000)
    const { useAuthStore } = await import('@/stores/auth')
    const store = useAuthStore()

    store.setExpiresAt(30)
    expect(store.expiresAt).toBe(1_000_000 + 30 * 1000)
  })

  it('isTokenValid returns true only when token present and not expiring within buffer', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(500_000)
    const { useAuthStore } = await import('@/stores/auth')
    const store = useAuthStore()

    expect(store.isTokenValid()).toBe(false)

    store.accessToken = 'valid-token'
    store.expiresAt = 500_000 + 20_000
    expect(store.isTokenValid()).toBe(true)

    store.expiresAt = 500_000 + 5_000
    expect(store.isTokenValid()).toBe(false)
  })

  it('clearAuth resets state', async () => {
    const { useAuthStore } = await import('@/stores/auth')
    const store = useAuthStore()

    store.accessToken = 'test-token'
    store.expiresAt = 900_000

    store.clearAuth()
    expect(store.accessToken).toBeNull()
    expect(store.expiresAt).toBeNull()
  })

  it('refreshOnce memoizes in-flight promise and clears it after completion', async () => {
    const refreshTokenMock = vi.fn().mockResolvedValue({
      accessToken: 'refreshed',
      expiresIn: 100,
    })
    vi.doMock('@/api/login', () => ({ refreshToken: refreshTokenMock }))

    const { useAuthStore } = await import('@/stores/auth')
    const store = useAuthStore()
    vi.spyOn(store, 'setToken')
    vi.spyOn(store, 'setExpiresAt')

    const p1 = store.refreshOnce()
    const p2 = store.refreshOnce()

    const token = await p1
    expect(token).toBe('refreshed')
    await p2
    expect(refreshTokenMock).toHaveBeenCalledTimes(1)
    expect(store.setToken).toHaveBeenCalledWith('refreshed')
    expect(store.setExpiresAt).toHaveBeenCalledWith(100)
    expect(store.refreshPromise).toBeNull()
  })

  it('refreshOnce clears refreshPromise even when request fails', async () => {
    const refreshTokenMock = vi.fn().mockRejectedValue(new Error('fail'))
    vi.doMock('@/api/login', () => ({ refreshToken: refreshTokenMock }))
    const { useAuthStore } = await import('@/stores/auth')
    const store = useAuthStore()

    await expect(store.refreshOnce()).rejects.toThrow('fail')
    expect(store.refreshPromise).toBeNull()
  })

  it('ensureAuth returns true when token valid and clears auth on failed refresh', async () => {
    const refreshTokenMock = vi.fn().mockRejectedValue(new Error('refresh-failed'))
    vi.doMock('@/api/login', () => ({ refreshToken: refreshTokenMock }))
    const { useAuthStore } = await import('@/stores/auth')
    const store = useAuthStore()
    vi.spyOn(store, 'isTokenValid').mockReturnValueOnce(true)

    const ok = await store.ensureAuth()
    expect(ok).toBe(true)
    expect(refreshTokenMock).not.toHaveBeenCalled()

    vi.spyOn(store, 'isTokenValid').mockReturnValueOnce(false)
    vi.spyOn(store, 'clearAuth')
    const okAfter = await store.ensureAuth()
    expect(okAfter).toBe(false)
    expect(store.clearAuth).toHaveBeenCalled()
  })
})
