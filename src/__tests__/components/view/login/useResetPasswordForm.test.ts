import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FormInstance } from 'element-plus'

import message from '@/enum/message.json'
import { useResetPasswordForm } from '@/components/view/login/useResetPasswordForm'

const resetPasswordMutationMock = vi.hoisted(() => vi.fn())
const elMessageSuccessMock = vi.hoisted(() => vi.fn())
const elMessageErrorMock = vi.hoisted(() => vi.fn())
const isPendingMock = { value: false }
const routeQuery: { token?: string } = { token: 'token-123' }

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: routeQuery,
  }),
}))

vi.mock('@/hooks/useResetPasswordApi', () => ({
  useResetPasswordApi: () => ({
    resetPasswordMutation: resetPasswordMutationMock,
    isPending: isPendingMock,
  }),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: elMessageSuccessMock,
    error: elMessageErrorMock,
  },
}))

const emitMock = vi.fn<(event: 'resetPasswordSubmitSuccess') => void>()

const createComposable = () => useResetPasswordForm(emitMock)

describe('useResetPasswordForm', () => {
  beforeEach(() => {
    resetPasswordMutationMock.mockReset()
    elMessageSuccessMock.mockReset()
    elMessageErrorMock.mockReset()
    emitMock.mockReset()
    isPendingMock.value = false
    routeQuery.token = 'token-123'
  })

  it('initializes form state and validation rules', () => {
    const composable = createComposable()

    expect(composable.resetPasswordForm.password).toBe('')
    expect(composable.resetPasswordForm.confirmPassword).toBe('')
    expect(composable.disabled.value).toBe(true)

    type Rule = { message?: string; validator?: unknown }
    const passwordRules = composable.resetPasswordFormRules.password as unknown as Rule[]
    const confirmRules = composable.resetPasswordFormRules.confirmPassword as unknown as Rule[]

    expect(passwordRules?.[0]?.message).toBe(message.login.passwordRequired)
    expect(passwordRules?.[1]?.message).toBe(message.login.passwordLength)
    expect(passwordRules?.[2]?.message).toBe(message.login.passwordPattern)
    expect(confirmRules?.[0]?.message).toBe(message.login.confirmPasswordRequired)
  })

  it('computes disabled based on password validity and matching confirm password', () => {
    const composable = createComposable()

    expect(composable.disabled.value).toBe(true)

    composable.resetPasswordForm.password = 'short with spaces'
    composable.resetPasswordForm.confirmPassword = 'short with spaces'
    expect(composable.disabled.value).toBe(true)

    composable.resetPasswordForm.password = 'Secret123!@#'
    composable.resetPasswordForm.confirmPassword = 'Mismatch'
    expect(composable.disabled.value).toBe(true)

    composable.resetPasswordForm.confirmPassword = 'Secret123!@#'
    expect(composable.disabled.value).toBe(false)
  })

  it('validates confirm password matches the new password', () => {
    const composable = createComposable()
    const confirmRules = composable.resetPasswordFormRules.confirmPassword as unknown as Array<{
      validator?: (r: unknown, v: string, cb: (err?: Error | null) => void) => void
      message?: string
    }>

    // Find the validator rule (not the required rule)
    const validator = confirmRules.find((rule) => rule.validator)?.validator

    expect(typeof validator).toBe('function')

    const makeCallback = () => {
      const errors: Array<Error | null | undefined> = []
      const callback = (err?: Error | null) => {
        errors.push(err ?? null)
      }
      return { errors, callback }
    }

    if (validator) {
      composable.resetPasswordForm.password = 'Secret123!@#'

      const empty = makeCallback()
      validator({}, '', empty.callback)
      expect(empty.errors[0]?.message).toBe(message.login.confirmPasswordRequired)

      const mismatch = makeCallback()
      validator({}, 'OtherPassword', mismatch.callback)
      expect(mismatch.errors[0]?.message).toBe(message.login.confirmPasswordNotMatch)

      const match = makeCallback()
      validator({}, 'Secret123!@#', match.callback)
      expect(match.errors[0]).toBeNull()
    }
  })

  it('submits the form, calls API, and emits success on completion', async () => {
    resetPasswordMutationMock.mockResolvedValue({ message: '' })
    const composable = createComposable()

    composable.resetPasswordForm.password = 'Secret123!@#'
    composable.resetPasswordForm.confirmPassword = 'Secret123!@#'
    composable.resetPasswordFormRef.value = {
      validate: async (callback?: (valid: boolean) => void) => {
        if (!callback) return true
        const res = callback(true) as unknown
        const thenable = res as { then?: (...args: unknown[]) => unknown }
        if (typeof thenable.then === 'function') {
          await (res as Promise<unknown>)
        }
        return true
      },
    } as unknown as FormInstance

    await composable.resetPasswordFormSubmit()

    expect(resetPasswordMutationMock).toHaveBeenCalledWith({
      newPassword: 'Secret123!@#',
      resetToken: 'token-123',
    })
    expect(elMessageSuccessMock).toHaveBeenCalledWith(message.login.resetPasswordSuccess)
    expect(emitMock).toHaveBeenCalledWith('resetPasswordSubmitSuccess')
  })

  it('handles API error silently (error handling is done in axios interceptor)', async () => {
    const apiError = new Error('API error')
    resetPasswordMutationMock.mockRejectedValue(apiError)
    const composable = createComposable()

    composable.resetPasswordForm.password = 'Secret123!@#'
    composable.resetPasswordForm.confirmPassword = 'Secret123!@#'
    composable.resetPasswordFormRef.value = {
      validate: async (callback?: (valid: boolean) => void) => {
        if (!callback) return true
        const res = callback(true) as unknown
        const thenable = res as { then?: (...args: unknown[]) => unknown }
        if (typeof thenable.then === 'function') {
          await (res as Promise<unknown>)
        }
        return true
      },
    } as unknown as FormInstance

    await expect(composable.resetPasswordFormSubmit()).rejects.toThrow(apiError)

    expect(elMessageErrorMock).not.toHaveBeenCalled()
    expect(emitMock).not.toHaveBeenCalled()
  })

  it('blocks submission when no reset token is present', async () => {
    routeQuery.token = undefined
    const composable = createComposable()

    composable.resetPasswordForm.password = 'Secret123!@#'
    composable.resetPasswordForm.confirmPassword = 'Secret123!@#'
    composable.resetPasswordFormRef.value = {
      validate: async (callback?: (valid: boolean) => void) => {
        if (!callback) return true
        const res = callback(true) as unknown
        const thenable = res as { then?: (...args: unknown[]) => unknown }
        if (typeof thenable.then === 'function') {
          await (res as Promise<unknown>)
        }
        return true
      },
    } as unknown as FormInstance

    await composable.resetPasswordFormSubmit()

    expect(resetPasswordMutationMock).not.toHaveBeenCalled()
    expect(elMessageErrorMock).toHaveBeenCalledWith(message.login.resetPasswordInvalidToken)
    expect(emitMock).not.toHaveBeenCalled()
  })
})
