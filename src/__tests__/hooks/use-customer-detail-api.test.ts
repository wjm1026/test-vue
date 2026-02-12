// generated-by: ai-assist v1.0
// type: unit
// description: useCustomerDetailApi tests verifying query setup with userId ref, enabled state, and API integration.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const getCustomerDetailMock = vi.hoisted(() => vi.fn())
const useQueryMock = vi.hoisted(() => vi.fn())

vi.mock('@/api/customers', () => ({
  getCustomerDetail: getCustomerDetailMock,
}))

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

describe('useCustomerDetailApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getCustomerDetailMock.mockReset()
  })

  it('initializes query with userId ref and exposes returned bindings', async () => {
    // Purpose: verify hook sets up useQuery with correct queryKey, queryFn, and enabled state.
    const customerDetailRef = ref({
      userId: 'C-123',
      nickname: 'テストユーザー',
      status: 'active',
    })
    const userId = ref(123)
    type MockedQueryOptions = {
      queryKey: unknown[]
      queryFn: () => Promise<unknown>
      enabled: { value: boolean }
    }

    let capturedOptions: Record<string, unknown> | null = null
    useQueryMock.mockImplementation((options: Record<string, unknown>) => {
      capturedOptions = options
      return {
        data: customerDetailRef,
        isLoading: false,
      }
    })

    const { useCustomerDetailApi } = await import('@/hooks/useCustomerDetailApi')
    const { customerDetail, isLoading } = useCustomerDetailApi(userId)

    expect(customerDetail).toBe(customerDetailRef)
    expect(isLoading).toBe(false)
    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const options = capturedOptions as MockedQueryOptions | null
    expect(options?.queryKey).toEqual(['customerDetail', userId])
    expect(options?.enabled.value).toBe(true)
    expect(typeof options?.queryFn).toBe('function')

    getCustomerDetailMock.mockResolvedValueOnce({
      userId: 'C-123',
      nickname: 'テストユーザー',
    })
    await options?.queryFn()
    expect(getCustomerDetailMock).toHaveBeenCalledWith(123)
  })

  it('disables query when userId is 0', async () => {
    // Purpose: verify query is disabled when userId is invalid (0 or falsy).
    const userId = ref(0)
    let capturedOptions: Record<string, unknown> | null = null

    useQueryMock.mockImplementation((options: Record<string, unknown>) => {
      capturedOptions = options
      return {
        data: ref(null),
        isLoading: false,
      }
    })

    const { useCustomerDetailApi } = await import('@/hooks/useCustomerDetailApi')
    useCustomerDetailApi(userId)

    const options = capturedOptions as { enabled: { value: boolean } } | null
    expect(options?.enabled.value).toBe(false)
  })

  it('enables query when userId is valid', async () => {
    // Purpose: verify query is enabled when userId has a valid value.
    const userId = ref(456)
    let capturedOptions: Record<string, unknown> | null = null

    useQueryMock.mockImplementation((options: Record<string, unknown>) => {
      capturedOptions = options
      return {
        data: ref(null),
        isLoading: false,
      }
    })

    const { useCustomerDetailApi } = await import('@/hooks/useCustomerDetailApi')
    useCustomerDetailApi(userId)

    const options = capturedOptions as { enabled: { value: boolean } } | null
    expect(options?.enabled.value).toBe(true)
  })
})
