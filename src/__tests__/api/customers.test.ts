// generated-by: ai-assist v1.0
// type: unit
// description: Customers API tests verifying createApiRequest usage and parameter forwarding.

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SortOrder, pageSize } from '@/enum'

const createApiRequestMock = vi.hoisted(() =>
  vi.fn(() => {
    const handler = vi.fn().mockResolvedValue({})
    createdHandlers.push(handler)
    return handler
  }),
)

const createdHandlers: ReturnType<typeof vi.fn>[] = []

vi.mock('@/api/request', () => ({
  createApiRequest: createApiRequestMock,
}))

describe('customers API', () => {
  beforeEach(() => {
    vi.resetModules()
    createApiRequestMock.mockClear()
    createdHandlers.length = 0
  })

  it('forwards parameters to customer list request', async () => {
    const module = await import('@/api/customers')
    const [requestHandler] = createdHandlers
    requestHandler.mockResolvedValue({ data: [] })

    await module.getCustomerList({
      query: 'user',
      offset: 5,
      limit: 10,
      sortKey: 'nickname',
      sortOrder: SortOrder.Asc,
      status: 'suspended',
    })

    expect(requestHandler).toHaveBeenCalledWith({
      url: '/user-list',
      method: 'GET',
      params: expect.objectContaining({
        query: 'user',
        offset: 5,
        limit: 10,
        sortKey: 'nickname',
        sortOrder: SortOrder.Asc,
        status: 'suspended',
      }),
    })
  })

  it('applies default page size when limit is omitted', async () => {
    const module = await import('@/api/customers')
    const [requestHandler] = createdHandlers
    requestHandler.mockResolvedValue({ data: [] })

    await module.getCustomerList({
      query: '',
      offset: 0,
      sortKey: 'nickname',
      sortOrder: SortOrder.Desc,
    })

    expect(requestHandler).toHaveBeenCalledWith({
      url: '/user-list',
      method: 'GET',
      params: expect.objectContaining({
        limit: pageSize,
        offset: 0,
        sortOrder: SortOrder.Desc,
      }),
    })
  })

  it('requests customer detail by userId', async () => {
    const module = await import('@/api/customers')
    const [, detailHandler] = createdHandlers
    detailHandler.mockResolvedValue({ data: {} })

    await module.getCustomerDetail(42)

    expect(detailHandler).toHaveBeenCalledWith({
      url: '/user-detail',
      method: 'GET',
      params: { userId: 42 },
    })
  })
})
