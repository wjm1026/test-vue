// generated-by: ai-assist v1.0
// type: unit
// description: Structural tests for src/api/types/customers.ts.

import { describe, expect, expectTypeOf, it } from 'vitest'

import type {
  Customer,
  CustomerDetail,
  CustomerDetailResponse,
  CustomerListResponse,
} from '@/api/types/customers'

describe('Customer types', () => {
  it('extends CustomerDetail from Customer with totalLikes', () => {
    expectTypeOf<CustomerDetail>().toMatchTypeOf<Customer>()
    expectTypeOf<CustomerDetail>().toMatchTypeOf<Customer & { totalLikes: number }>()
    expectTypeOf<CustomerDetailResponse>().toEqualTypeOf<CustomerDetail>()
    expect(true).toBe(true)
  })

  it('allows optional status field on Customer', () => {
    expectTypeOf<Customer>().toMatchTypeOf<{
      status?: 'public' | 'private'
    }>()

    // Runtime guard for optional status variations.
    const publicCustomer: Customer = {
      userId: 'u-1',
      nickname: 'Alice',
      ageGroup: '20s',
      gender: 'female',
      totalReviews: 10,
      status: 'public',
      updatedAt: '2024-01-01T00:00:00Z',
    }
    const privateCustomer: Customer = {
      userId: 'u-2',
      nickname: 'Bob',
      ageGroup: '30s',
      gender: 'male',
      totalReviews: 5,
      updatedAt: '2024-01-02T00:00:00Z',
    }
    expect(publicCustomer.status).toBe('public')
    expect(privateCustomer.status).toBeUndefined()
  })
})

describe('Customer responses', () => {
  it('structures the list response with total count and users array', () => {
    expectTypeOf<CustomerListResponse>().toMatchTypeOf<{
      total: number
      users: Customer[]
    }>()

    const example: CustomerListResponse = {
      total: 2,
      users: [
        {
          userId: 'u-1',
          nickname: 'Alice',
          ageGroup: '20s',
          gender: 'female',
          totalReviews: 10,
          status: 'public',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          userId: 'u-2',
          nickname: 'Bob',
          ageGroup: '30s',
          gender: 'male',
          totalReviews: 5,
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ],
    }
    expect(example.users[1].nickname).toBe('Bob')
  })
})
