// generated-by: ai-assist v1.0
// type: unit
// description: useAccountsPage composable tests covering initialization, pagination, and navigation.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import { SortOrder, pageSize } from '@/enum'
import { routeNames } from '@/router/routes'

type UseAccountListApiArgs = Parameters<
  typeof import('@/hooks/useAccountListApi').useAccountListApi
>

const pushMock = vi.hoisted(() => vi.fn())

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
    }),
  }
})

const accountListRef = ref<unknown>(undefined)
const isLoadingRef = ref(false)

const useAccountListApiMock = vi.hoisted(() =>
  vi.fn(() => ({
    accountList: accountListRef,
    isLoading: isLoadingRef,
  })),
)

vi.mock('@/hooks/useAccountListApi', () => ({
  useAccountListApi: useAccountListApiMock,
}))

vi.mock('@/hooks/useDebouncedRef', () => ({
  useDebouncedRef: <T>(source: { value: T }) => source,
}))

async function loadComposable() {
  const module = await import('@/views/accounts/useAccountsPage')
  return module.useAccountsPage()
}

describe('useAccountsPage', () => {
  beforeEach(() => {
    vi.resetModules()
    pushMock.mockClear()
    useAccountListApiMock.mockClear()
    accountListRef.value = { total: 0, accounts: [] }
    isLoadingRef.value = false
  })

  it('initializes refs and passes reactive params to useAccountListApi', async () => {
    const composable = await loadComposable()

    expect(composable.page.value).toBe(1)
    expect(composable.searchKeyword.value).toBe('')
    expect(composable.sortField.value).toBe('')
    expect(composable.sortOrder.value).toBe(SortOrder.Asc)
    expect(composable.accountList).toBe(accountListRef)
    expect(composable.isLoading).toBe(isLoadingRef)

    expect(useAccountListApiMock).toHaveBeenCalledTimes(1)
    const [params, pageRef] = useAccountListApiMock.mock
      .calls[0] as unknown as UseAccountListApiArgs

    expect(pageRef).toBe(composable.page)
    expect(params.query).toBe(composable.searchKeyword)
    expect(params.sortKey).toBe(composable.sortField)
    expect(params.sortOrder).toBe(composable.sortOrder)
    expect(params.offset.value).toBe(0)

    composable.pageChange(3)
    expect(composable.page.value).toBe(3)
    expect(params.offset.value).toBe((3 - 1) * pageSize)
  })

  it('accountAdd navigates to account create route', async () => {
    const composable = await loadComposable()

    composable.accountAdd()

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({ name: routeNames.accounts.create })
  })
})
