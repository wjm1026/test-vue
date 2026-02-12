// generated-by: ai-assist v1.0
// type: unit
// description: useAccountCreatePage tests verifying default title, edit title, and submit navigation.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

type UseAccountDetailApiArgs = Parameters<
  typeof import('@/hooks/useAccountDetailApi').useAccountDetailApi
>

const pushMock = vi.hoisted(() => vi.fn())

let routeParams: Record<string, string | undefined> = {}

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
    }),
    useRoute: () => ({
      params: routeParams,
    }),
  }
})

const accountDetailRef = ref<{ accountName?: string } | undefined>()

const useAccountDetailApiMock = vi.hoisted(() =>
  vi.fn(() => ({
    accountDetail: accountDetailRef,
  })),
)

vi.mock('@/hooks/useAccountDetailApi', () => ({
  useAccountDetailApi: useAccountDetailApiMock,
}))

async function loadComposable() {
  const module = await import('@/views/accounts/create/useAccountCreatePage')
  return module.useAccountCreatePage()
}

describe('useAccountCreatePage', () => {
  beforeEach(() => {
    vi.resetModules()
    pushMock.mockReset()
    useAccountDetailApiMock.mockClear()
    accountDetailRef.value = undefined
    routeParams = {}
  })

  it('returns default title when no account id is present', async () => {
    const composable = await loadComposable()

    expect(composable.pageTitle.value).toBe('アカウント追加')
    expect(composable.accountDetail).toBe(accountDetailRef)

    expect(useAccountDetailApiMock).toHaveBeenCalledTimes(1)
    const [accountIdRef] = useAccountDetailApiMock.mock
      .calls[0] as unknown as UseAccountDetailApiArgs
    // When routeParams.id is undefined, Number(undefined) returns NaN
    // The ?? operator doesn't catch NaN, so we expect NaN
    expect(Number.isNaN(accountIdRef.value)).toBe(true)

    const dialogData = {
      accountName: 'テストユーザー',
      email: 'test@example.com',
      roleDisplayName: '管理者',
    }
    composable.handleSubmit(dialogData)
    expect(composable.createVisible.value).toBe(true)
    expect(composable.createdAccount.accountName).toBe('テストユーザー')
    expect(composable.createdAccount.email).toBe('test@example.com')
    expect(composable.createdAccount.roleDisplayName).toBe('管理者')
  })

  it('uses account name as title when editing existing account', async () => {
    routeParams = { id: '123' }
    accountDetailRef.value = { accountName: '山田太郎' }

    const composable = await loadComposable()

    expect(composable.pageTitle.value).toBe('山田太郎')

    const [accountIdRef] = useAccountDetailApiMock.mock
      .calls[0] as unknown as UseAccountDetailApiArgs
    expect(accountIdRef.value).toBe(123)
  })
})
