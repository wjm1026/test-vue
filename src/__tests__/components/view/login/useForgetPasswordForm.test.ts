import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FormInstance } from 'element-plus'

import { useForgetPasswordForm } from '@/components/view/login/useForgetPasswordForm'
import message from '@/enum/message.json'

const goMock = vi.hoisted(() => vi.fn())
const forgetPasswordMutationMock = vi.hoisted(() => vi.fn())
const isPendingMock = vi.hoisted(() => ({ value: false }))
const ElMessageSuccessMock = vi.hoisted(() => vi.fn())

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      go: goMock,
    }),
  }
})

vi.mock('@/hooks/useForgetPasswordApi', () => ({
  useForgetPasswordApi: () => ({
    forgetPasswordMutation: forgetPasswordMutationMock,
    isPending: isPendingMock,
  }),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: ElMessageSuccessMock,
  },
}))

const emitMock = vi.fn<(event: 'emailSubmitSuccess', email: string) => void>()

const createComposable = () => useForgetPasswordForm(emitMock)

describe('useForgetPasswordForm', () => {
  beforeEach(() => {
    emitMock.mockReset()
    forgetPasswordMutationMock.mockReset()
    ElMessageSuccessMock.mockClear()
    goMock.mockReset()
  })

  it('initializes reactive form state and validation rules', () => {
    const composable = createComposable()

    expect(composable.forgetPasswordForm.email).toBe('')
    expect(composable.disabled.value).toBe(true)
    expect(Array.isArray(composable.forgetPasswordFormRules.email)).toBe(true)
    type EmailRule = { message?: string }
    const emailRules = composable.forgetPasswordFormRules.email as unknown as EmailRule[]
    expect(emailRules?.[0]?.message).toBe(message.login.emailRequired)
    expect(emailRules?.[1]?.message).toBe(message.login.emailInvalid)
  })

  it('computes disabled based on email input', () => {
    const composable = createComposable()
    expect(composable.disabled.value).toBe(true)

    composable.forgetPasswordForm.email = 'user@example.com'
    expect(composable.disabled.value).toBe(false)

    composable.forgetPasswordForm.email = ''
    expect(composable.disabled.value).toBe(true)
  })

  it('initializes email field with initialEmail when provided', () => {
    const composable = useForgetPasswordForm(emitMock, 'preset@example.com')

    expect(composable.forgetPasswordForm.email).toBe('preset@example.com')
    expect(composable.disabled.value).toBe(false)
  })

  it('navigates back when goBack is called', () => {
    const composable = createComposable()

    composable.goBack()
    expect(goMock).toHaveBeenCalledWith(-1)
  })

  it('does nothing when forgetPasswordFormSubmit is called without form ref', async () => {
    const composable = createComposable()
    composable.forgetPasswordFormRef.value = undefined

    await composable.forgetPasswordFormSubmit()

    expect(forgetPasswordMutationMock).not.toHaveBeenCalled()
    expect(emitMock).not.toHaveBeenCalled()
  })

  it('does nothing when form validation fails', async () => {
    const composable = createComposable()
    const validateMock = vi.fn((callback: (valid: boolean) => void) => {
      callback(false)
    })
    composable.forgetPasswordFormRef.value = {
      validate: validateMock,
    } as unknown as FormInstance

    await composable.forgetPasswordFormSubmit()

    expect(validateMock).toHaveBeenCalled()
    expect(forgetPasswordMutationMock).not.toHaveBeenCalled()
    expect(emitMock).not.toHaveBeenCalled()
  })

  it('submits form and emits success event when validation passes', async () => {
    const composable = createComposable()
    composable.forgetPasswordForm.email = 'test@example.com'
    forgetPasswordMutationMock.mockResolvedValue(undefined)
    const validateMock = vi.fn((callback: (valid: boolean) => void) => {
      return callback(true)
    })
    composable.forgetPasswordFormRef.value = {
      validate: async (callback?: (valid: boolean) => void) => {
        // Call the spy so tests can assert it was invoked, then await any promise it returns.
        const result = validateMock(callback as (v: boolean) => void) as unknown
        const thenable = result as { then?: (...args: unknown[]) => unknown }
        if (typeof thenable.then === 'function') {
          await (result as Promise<unknown>)
        }
        return true
      },
    } as unknown as FormInstance

    await composable.forgetPasswordFormSubmit()

    expect(validateMock).toHaveBeenCalled()
    expect(forgetPasswordMutationMock).toHaveBeenCalledWith({
      email: 'test@example.com',
    })
    expect(ElMessageSuccessMock).not.toHaveBeenCalled()
    expect(emitMock).toHaveBeenCalledWith('emailSubmitSuccess', 'test@example.com')
  })

  it('handles error when forgetPasswordMutation fails', async () => {
    const composable = createComposable()
    composable.forgetPasswordForm.email = 'test@example.com'
    const error = new Error('API Error')
    // Let the mock reject so the composable surfaces the error and does not emit success.
    forgetPasswordMutationMock.mockRejectedValue(error)
    const validateMock = vi.fn((callback: (valid: boolean) => void) => {
      return callback(true)
    })
    composable.forgetPasswordFormRef.value = {
      validate: async (callback?: (valid: boolean) => void) => {
        const result = validateMock(callback as (v: boolean) => void) as unknown
        const thenable = result as { then?: (...args: unknown[]) => unknown }
        if (typeof thenable.then === 'function') {
          await (result as Promise<unknown>)
        }
        return true
      },
    } as unknown as FormInstance

    await expect(composable.forgetPasswordFormSubmit()).rejects.toThrow(error)

    expect(validateMock).toHaveBeenCalled()
    expect(forgetPasswordMutationMock).toHaveBeenCalledWith({
      email: 'test@example.com',
    })
    expect(ElMessageSuccessMock).not.toHaveBeenCalled()
    expect(emitMock).not.toHaveBeenCalled()
  })
})
