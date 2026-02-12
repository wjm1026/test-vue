// generated-by: ai-assist v1.0
// type: unit
// description: useAccountRoleApi tests verifying query configuration and data exposure.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const useQueryMock = vi.hoisted(() => vi.fn())
const getAccountRoleListMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/accounts', () => ({
  getAccountRoleList: getAccountRoleListMock,
}))

describe('useAccountRoleApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getAccountRoleListMock.mockReset()
  })

  it('initializes query with getAccountRoles and exposes role data', async () => {
    const rolesRef = ref([{ label: '管理者' }])
    type MockedQueryOptions = {
      queryKey: unknown[]
      queryFn: () => Promise<unknown>
      placeholderData: (prev: unknown) => unknown
    }

    let capturedOptions: Record<string, unknown> | null = null

    useQueryMock.mockImplementation((options: Record<string, unknown>) => {
      capturedOptions = options
      return { data: rolesRef }
    })

    const { useAccountRoleListApi } = await import('@/hooks/useAccountRoleListApi')
    const { accountRoleList } = useAccountRoleListApi()

    expect(accountRoleList).toBe(rolesRef)
    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const options = capturedOptions as MockedQueryOptions | null
    expect(options?.queryKey).toEqual(['accountRoleList'])
    expect(options?.queryFn).toBe(getAccountRoleListMock)
    expect(options?.placeholderData?.('prev')).toBe('prev')

    getAccountRoleListMock.mockResolvedValueOnce({
      roles: [{ roleId: 1, roleDisplayName: '閲覧者' }],
    })
    await options?.queryFn()
    expect(getAccountRoleListMock).toHaveBeenCalledTimes(1)
  })
})
