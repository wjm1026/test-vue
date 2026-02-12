import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import message from '@/enum/message.json'
import { routePaths } from '@/router/routes'

const pushMock = vi.fn()
const loginMutationMock = vi.fn()
const setTokenMock = vi.fn()
const setExpiresAtMock = vi.fn()
const setCompanyNameMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('@/hooks/useLoginApi', () => ({
  useLoginApi: () => ({
    loginMutation: loginMutationMock,
  }),
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    setToken: setTokenMock,
    setExpiresAt: setExpiresAtMock,
    setCompanyName: setCompanyNameMock,
  }),
}))

const successMock = vi.fn()

beforeEach(() => {
  pushMock.mockClear()
  successMock.mockClear()
  loginMutationMock.mockReset()
  setTokenMock.mockReset()
  setExpiresAtMock.mockReset()
  setCompanyNameMock.mockReset()
  loginMutationMock.mockResolvedValue({
    accessToken: 'token',
    expiresIn: 3600,
    companyName: 'Test Company',
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const createComposable = async () => {
  vi.resetModules()
  vi.stubGlobal('ElMessage', { success: successMock })
  const module = await import('@/components/view/login/useLoginForm')
  return module.useLoginForm()
}

describe('useLoginForm', () => {
  it('initializes form state, rules, and disabled flag', async () => {
    const composable = await createComposable()

    expect(composable.loginForm.email).toBe('')
    expect(composable.loginForm.password).toBe('')
    expect(composable.disabled.value).toBe(true)

    type Rule = { message?: string }
    const emailRules = composable.loginFormRules.email as unknown as Rule[]
    const passwordRules = composable.loginFormRules.password as unknown as Rule[]

    expect(emailRules?.[0]?.message).toBe(message.login.emailRequired)
    expect(emailRules?.[1]?.message).toBe(message.login.emailInvalid)
    expect(passwordRules?.[0]?.message).toBe(message.login.passwordRequired)
    expect(passwordRules?.[1]?.message).toBe(message.login.passwordLength)
    expect(passwordRules?.[2]?.message).toBe(message.login.passwordPattern)
    expect(passwordRules?.length).toBe(3)
  }, 10000)

  it('toggles disabled based on email presence and valid password pattern', async () => {
    const composable = await createComposable()

    expect(composable.disabled.value).toBe(true)

    composable.loginForm.email = 'user@example.com'
    expect(composable.disabled.value).toBe(true)

    composable.loginForm.password = 'short @'
    expect(composable.disabled.value).toBe(true)

    composable.loginForm.password = 'Secret123!@#'
    expect(composable.disabled.value).toBe(false)

    composable.loginForm.email = ''
    expect(composable.disabled.value).toBe(true)
  })

  it('calls router.push to forget password path when forgetPasswordHandle is executed', async () => {
    const composable = await createComposable()

    composable.forgetPasswordHandle()
    expect(pushMock).toHaveBeenCalledWith(routePaths.forgetPassword)
  })

  it('runs validation, shows success message, and routes on loginFormSubmit success', async () => {
    const composable = await createComposable()
    composable.loginForm.email = 'user@example.com'
    composable.loginForm.password = 'Secret123!@#'

    expect(
      (globalThis as unknown as { ElMessage?: { success?: unknown } }).ElMessage &&
        typeof (globalThis as unknown as { ElMessage?: { success?: unknown } }).ElMessage?.success,
    ).toBe('function')

    let validateCallback: ((valid: boolean) => void) | undefined
    const validateSpy = vi.fn(async (callback?: (valid: boolean) => void) => {
      validateCallback = callback
      return true
    })
    composable.loginFormRef.value = {
      validate: validateSpy,
    } as never

    await composable.loginFormSubmit()

    expect(validateSpy).toHaveBeenCalledTimes(1)
    expect(pushMock).not.toHaveBeenCalled()
    expect(validateCallback).toBeTypeOf('function')
    validateCallback?.(true)
    expect(validateCallback).toBeTypeOf('function')
    await Promise.resolve()
    expect(pushMock).toHaveBeenCalledWith(routePaths.projects.root)
    expect(setTokenMock).toHaveBeenCalledWith('token')
    expect(setExpiresAtMock).toHaveBeenCalledWith(3600)
    expect(setCompanyNameMock).toHaveBeenCalledWith('Test Company')
  })

  it('stops when validation fails', async () => {
    const composable = await createComposable()
    composable.loginForm.email = 'user@example.com'
    composable.loginForm.password = 'Secret123!@#'

    let validateCallback: ((valid: boolean) => void) | undefined
    const validateSpy = vi.fn(async (callback?: (valid: boolean) => void) => {
      validateCallback = callback
      return false
    })
    composable.loginFormRef.value = {
      validate: validateSpy,
    } as never

    await composable.loginFormSubmit()

    expect(validateSpy).toHaveBeenCalledTimes(1)
    validateCallback?.(false)
    expect(successMock).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })
})
