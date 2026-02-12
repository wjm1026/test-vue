// generated-by: ai-assist v1.0
// type: unit
// description: Tests for useAccountsForm composable covering defaults, edit hydration, submit, and cancel behavior.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive, ref } from 'vue'

import { routePaths } from '@/router/paths'
import type { AccountDetailResponse } from '@/api/types/accounts'

const pushMock = vi.hoisted(() => vi.fn())
let routeParams: Record<string, string> = {}

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({
      params: routeParams,
    }),
    useRouter: () => ({
      push: pushMock,
    }),
  }
})

const submitAccountMock = vi.hoisted(() => vi.fn())
const isPendingRef = ref(false)

vi.mock('@/hooks/useAccountApi', () => ({
  useAccountApi: () => ({
    submitAccount: submitAccountMock,
    isPending: isPendingRef,
  }),
}))

const accountRoleListRef = ref<
  { roles: Array<{ roleId: number; roleDisplayName: string }> } | undefined
>(undefined)
const isLoadingRoleListRef = ref(false)

vi.mock('@/hooks/useAccountRoleListApi', () => ({
  useAccountRoleListApi: () => ({
    accountRoleList: accountRoleListRef,
    isLoading: isLoadingRoleListRef,
  }),
}))

async function createComposable(options?: {
  routeId?: string
  accountDetail?: AccountDetailResponse
  setupRoles?: boolean
}) {
  vi.resetModules()
  routeParams = options?.routeId ? { id: options.routeId } : {}
  pushMock.mockReset()
  submitAccountMock.mockReset()
  isPendingRef.value = false
  accountRoleListRef.value = options?.accountDetail
    ? { roles: [{ roleId: 1, roleDisplayName: '管理者' }] }
    : options?.setupRoles
      ? { roles: [{ roleId: 1, roleDisplayName: '管理者' }] }
      : undefined

  const module = await import('@/components/view/accounts/useAccountsForm')
  const emit = vi.fn()
  const props = reactive<{ accountDetail?: AccountDetailResponse }>({
    accountDetail: options?.accountDetail,
  })
  const composable = module.useAccountsForm(emit, props)
  return { composable, emit, props }
}

describe('useAccountsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    accountRoleListRef.value = undefined
    isLoadingRoleListRef.value = false
    routeParams = {}
  })

  it('initializes defaults in create mode', async () => {
    const { composable } = await createComposable()

    expect(composable.accountForm.accountId).toBeUndefined()
    expect(composable.accountForm.accountName).toBe('')
    expect(composable.accountForm.email).toBe('')
    expect(composable.accountForm.password).toBe('')
    expect(composable.accountForm.roleId).toBeUndefined()

    expect(composable.isEdit.value).toBe(false)
    expect(composable.submitLabel.value).toBe('登録する')
    expect(composable.disabled.value).toBe(true)
    expect(composable.accountFormRules.value.password).toBeUndefined()
  }, 10000)

  it('hydrates account form when editing and exposes password rule', async () => {
    const detail: AccountDetailResponse = {
      accountId: 123,
      accountName: '山田太郎',
      email: 'yamada@example.com',
      roleId: 1,
      roleDisplayName: 'ADMIN',
      statusCode: '00',
      statusDisplayName: '有効',
      password: 'secret',
    }
    const { composable } = await createComposable({ routeId: '123', accountDetail: detail })

    expect(composable.isEdit.value).toBe(true)
    expect(composable.accountForm.accountId).toBe(123)
    expect(composable.accountForm.accountName).toBe('山田太郎')
    expect(composable.accountForm.email).toBe('yamada@example.com')
    expect(composable.accountForm.roleId).toBe(1)
    expect(composable.accountForm.password).toBe('secret')
    expect(composable.submitLabel.value).toBe('決定する')
    expect(Array.isArray(composable.accountFormRules.value.password)).toBe(true)
  })

  it('validates form, submits account data, and emits success event with dialog payload', async () => {
    const { composable, emit } = await createComposable({ setupRoles: true })

    composable.accountFormRef.value = {
      validate: vi.fn().mockResolvedValue(true),
    } as never

    composable.accountForm.accountName = '  山田太郎  '
    composable.accountForm.email = '  yamada@example.com '
    composable.accountForm.roleId = 1

    const response = {
      resultCode: 1,
    }
    submitAccountMock.mockResolvedValue(response)

    await composable.handleSubmit()

    expect(submitAccountMock).toHaveBeenCalledWith({
      accountName: '山田太郎',
      email: 'yamada@example.com',
      roleId: 1,
    })
    expect(emit).toHaveBeenCalledWith('successAccountSubmit', {
      accountName: '山田太郎',
      email: 'yamada@example.com',
      roleDisplayName: '管理者',
    })
  })

  it('navigates back to accounts list on cancel', async () => {
    const { composable } = await createComposable()
    composable.handleCancel()
    expect(pushMock).toHaveBeenCalledWith(routePaths.accounts.root)
  })
})
