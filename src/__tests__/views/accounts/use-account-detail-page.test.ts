// generated-by: ai-assist v1.0
// type: unit
// description: useAccountDetailPage composable tests validating detail wiring, masked password, and edit navigation.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { routeNames, routePaths } from '@/router/routes'
import message from '@/enum/message.json'

type UseAccountDetailApiArgs = Parameters<
  typeof import('@/hooks/useAccountDetailApi').useAccountDetailApi
>

const pushMock = vi.hoisted(() => vi.fn())
const elMessageSuccessMock = vi.hoisted(() => vi.fn())
const elMessageErrorMock = vi.hoisted(() => vi.fn())

let routeId = '1'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({
      params: { id: routeId },
    }),
    useRouter: () => ({
      push: pushMock,
    }),
  }
})

const accountDetailRef = ref<
  | {
      accountId?: number
      accountName?: string
      email?: string
      password?: string
      roleId?: number
      roleDisplayName?: string
      statusCode?: string
      statusDisplayName?: string
    }
  | undefined
>()
const isLoadingRef = ref(false)
const isDeleteLoadingRef = ref(false)
let deleteAccountMutateAsyncMock = vi.fn()

const useAccountDetailApiMock = vi.hoisted(() =>
  vi.fn(() => ({
    accountDetail: accountDetailRef,
    isLoading: isLoadingRef,
  })),
)

const useAccountDeleteApiMock = vi.hoisted(() =>
  vi.fn(() => ({
    deleteAccountMutateAsync: deleteAccountMutateAsyncMock,
    isDeleteLoading: isDeleteLoadingRef,
  })),
)

vi.mock('@/hooks/useAccountDetailApi', () => ({
  useAccountDetailApi: useAccountDetailApiMock,
}))

vi.mock('@/hooks/useAccountDeleteApi', () => ({
  useAccountDeleteApi: useAccountDeleteApiMock,
}))

const isStatusLoadingRef = ref(false)
let updateAccountStatusMock = vi.fn()
const useAccountStatusApiMock = vi.hoisted(() =>
  vi.fn(() => ({
    updateAccountStatus: updateAccountStatusMock,
    isStatusLoading: isStatusLoadingRef,
  })),
)
vi.mock('@/hooks/useAccountStatusApi', () => ({
  useAccountStatusApi: useAccountStatusApiMock,
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: elMessageSuccessMock,
    error: elMessageErrorMock,
  },
}))

async function loadComposable() {
  const module = await import('@/views/accounts/detail/useAccountDetailPage')
  return module.useAccountDetailPage()
}

describe('useAccountDetailPage', () => {
  beforeEach(() => {
    vi.resetModules()
    pushMock.mockReset()
    useAccountDetailApiMock.mockClear()
    useAccountDeleteApiMock.mockClear()
    useAccountStatusApiMock.mockClear()
    routeId = '1'
    accountDetailRef.value = undefined
    isLoadingRef.value = false
    isDeleteLoadingRef.value = false
    deleteAccountMutateAsyncMock = vi.fn()
    elMessageSuccessMock.mockReset()
    elMessageErrorMock.mockReset()
    useAccountDeleteApiMock.mockReturnValue({
      deleteAccountMutateAsync: deleteAccountMutateAsyncMock,
      isDeleteLoading: isDeleteLoadingRef,
    })
    updateAccountStatusMock = vi.fn()
    useAccountStatusApiMock.mockReturnValue({
      updateAccountStatus: updateAccountStatusMock,
      isStatusLoading: isStatusLoadingRef,
    })
  })

  it('computes account info with masked password and exposes api refs', async () => {
    accountDetailRef.value = {
      accountId: 1,
      accountName: '山田太郎',
      email: 'yamada@example.com',
      password: 'abc',
      roleId: 1,
      roleDisplayName: 'ADMIN',
      statusCode: '00',
      statusDisplayName: '有効',
    }

    const composable = await loadComposable()

    expect(useAccountDetailApiMock).toHaveBeenCalledTimes(1)
    const [accountIdRef] = useAccountDetailApiMock.mock
      .calls[0] as unknown as UseAccountDetailApiArgs
    expect(accountIdRef.value).toBe(1)

    expect(composable.accountDetail).toBe(accountDetailRef)
    expect(composable.isLoading).toBe(isLoadingRef)
    expect(composable.isDeleteLoading).toBe(isDeleteLoadingRef)

    const info = composable.accountInfo.value
    expect(info).toEqual([
      { label: '氏名', value: '山田太郎' },
      { label: 'メールアドレス', value: 'yamada@example.com' },
      { label: 'ロール', value: 'ADMIN' },
      { label: 'ステータス', value: '有効' },
    ])
  })

  it('handleEdit routes to account create with id', async () => {
    routeId = '123'
    accountDetailRef.value = { accountName: 'Test' }

    const composable = await loadComposable()
    composable.handleEdit()

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({
      name: routeNames.accounts.create,
      params: { id: 123 },
    })
  })

  it('handleDelete calls API, shows success message, and routes back to list', async () => {
    routeId = '99'
    accountDetailRef.value = {
      accountId: 99,
      accountName: '田中',
      email: 'tanaka@example.com',
      password: '12345678',
      roleId: 1,
      roleDisplayName: 'ADMIN',
      statusCode: '00',
      statusDisplayName: '有効',
    }
    deleteAccountMutateAsyncMock = vi.fn().mockResolvedValue({ resultCode: 1 })
    useAccountDeleteApiMock.mockReturnValue({
      deleteAccountMutateAsync: deleteAccountMutateAsyncMock,
      isDeleteLoading: isDeleteLoadingRef,
    })

    const composable = await loadComposable()

    await composable.handleDelete()

    expect(deleteAccountMutateAsyncMock).toHaveBeenCalledWith(99)
    expect(elMessageSuccessMock).toHaveBeenCalledWith(message.account.deleteSuccess)
    expect(pushMock).toHaveBeenCalledWith(routePaths.accounts.root)
    expect(elMessageErrorMock).not.toHaveBeenCalled()
  })

  it('handleDelete skips navigation when API fails', async () => {
    deleteAccountMutateAsyncMock = vi.fn().mockRejectedValue(new Error('delete failed'))
    useAccountDeleteApiMock.mockReturnValue({
      deleteAccountMutateAsync: deleteAccountMutateAsyncMock,
      isDeleteLoading: isDeleteLoadingRef,
    })

    const composable = await loadComposable()

    await expect(composable.handleDelete()).rejects.toThrow('delete failed')

    expect(deleteAccountMutateAsyncMock).toHaveBeenCalledWith(1)
    expect(elMessageSuccessMock).not.toHaveBeenCalled()
    expect(elMessageErrorMock).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('handleAccountStatus toggles status and updates local detail on success', async () => {
    routeId = '5'
    accountDetailRef.value = {
      accountId: 5,
      accountName: 'Sato',
      email: 'sato@example.com',
      password: 'pwd',
      roleId: 1,
      roleDisplayName: 'ADMIN',
      statusCode: '00',
      statusDisplayName: '有効',
    }
    const response = {
      accountId: 5,
      statusCode: '01',
      statusDisplayName: '無効',
    }
    updateAccountStatusMock = vi.fn().mockResolvedValue(response)
    useAccountStatusApiMock.mockReturnValue({
      updateAccountStatus: updateAccountStatusMock,
      isStatusLoading: isStatusLoadingRef,
    })

    const composable = await loadComposable()

    // call with the same reference to ensure composable syncs accountDetail.value
    await composable.handleUpdateAccountStatus()

    expect(updateAccountStatusMock).toHaveBeenCalledWith({
      accountId: 5,
      statusCode: '01',
    })
    expect(elMessageSuccessMock).toHaveBeenCalledWith(message.account.updateStatusSuccess)
    expect(accountDetailRef.value?.statusCode).toBe('01')
    expect(accountDetailRef.value?.statusDisplayName).toBe('無効')
  })

  it('handleAccountStatus fails silently when API errors', async () => {
    routeId = '6'
    accountDetailRef.value = {
      accountId: 6,
      accountName: 'Suzuki',
      email: 'suzuki@example.com',
      password: 'pwd',
      roleId: 1,
      roleDisplayName: 'ADMIN',
      statusCode: '00',
      statusDisplayName: '有効',
    }
    updateAccountStatusMock = vi.fn().mockRejectedValue(new Error('status fail'))
    useAccountStatusApiMock.mockReturnValue({
      updateAccountStatus: updateAccountStatusMock,
      isStatusLoading: isStatusLoadingRef,
    })

    const composable = await loadComposable()

    await expect(composable.handleUpdateAccountStatus()).rejects.toThrow('status fail')

    expect(updateAccountStatusMock).toHaveBeenCalledWith({
      accountId: 6,
      statusCode: '01',
    })
    expect(elMessageSuccessMock).not.toHaveBeenCalled()
  })
})
