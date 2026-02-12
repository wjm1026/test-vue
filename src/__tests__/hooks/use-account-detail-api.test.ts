import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const useQueryMock = vi.hoisted(() => vi.fn())
const getAccountDetailMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/accounts', () => ({
  getAccountDetail: getAccountDetailMock,
}))

describe('useAccountDetailApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getAccountDetailMock.mockReset()
  })

  it('initializes query with account id ref and exposes returned bindings', async () => {
    const accountDetailRef = ref({ data: { name: '山田太郎' } })
    const accountId = ref(1)
    type MockedQueryOptions = {
      queryKey: unknown[]
      queryFn: () => Promise<unknown>
      enabled: () => boolean
      placeholderData: (prev: unknown) => unknown
    }

    let capturedOptions: Record<string, unknown> | null = null
    useQueryMock.mockImplementation((options: Record<string, unknown>) => {
      capturedOptions = options
      return {
        data: accountDetailRef,
        isLoading: false,
      }
    })

    const { useAccountDetailApi } = await import('@/hooks/useAccountDetailApi')
    const { accountDetail, isLoading } = useAccountDetailApi(accountId)

    expect(accountDetail).toBe(accountDetailRef)
    expect(isLoading).toBe(false)
    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const options = capturedOptions as MockedQueryOptions | null
    expect(options?.queryKey).toEqual(['accountDetail', accountId])
    expect(options?.enabled()).toBe(true)
    expect(options?.placeholderData?.('prev')).toBe('prev')

    getAccountDetailMock.mockResolvedValueOnce({ data: { id: 1 } })
    await options?.queryFn()
    expect(getAccountDetailMock).toHaveBeenCalledWith(1)
  })

  it('disables query when account id is empty', async () => {
    const accountId = ref(0)
    let enabledFn: (() => boolean) | undefined

    useQueryMock.mockImplementation((options: Record<string, unknown>) => {
      enabledFn = options.enabled as () => boolean
      return { data: undefined, isLoading: false }
    })

    const { useAccountDetailApi } = await import('@/hooks/useAccountDetailApi')
    useAccountDetailApi(accountId)

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    expect(enabledFn?.()).toBe(false)
  })
})
