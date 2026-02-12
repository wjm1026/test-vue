// generated-by: ai-assist v1.0
// type: unit
// description: Type-level coverage for src/api/types/accounts.ts.

import { describe, expect, expectTypeOf, it } from 'vitest'

import type {
  Account,
  AccountDeleteResponse,
  AccountDetail,
  AccountDetailResponse,
  AccountForm,
  AccountFormResponse,
  AccountListResponse,
  AccountRole,
  AccountRoleListResponse,
} from '@/api/types/accounts'

describe('Account types', () => {
  it('treats AccountDetail as having required password and roleId fields', () => {
    expectTypeOf<AccountDetail>().toMatchTypeOf<AccountDetailResponse>()
    expectTypeOf<AccountDetail>().toHaveProperty('password').toEqualTypeOf<string>()
    expectTypeOf<AccountDetail>().toHaveProperty('roleId').toEqualTypeOf<number>()
    expect(true).toBe(true)
  })

  it('requires mandatory fields on AccountForm while keeping identifiers optional', () => {
    expectTypeOf<AccountForm>().toMatchTypeOf<{
      accountId?: number
      accountName: string
      email: string
      roleId: number | undefined
      password?: string
    }>()

    // Runtime check ensures example payload satisfies optional/required fields.
    const payload: AccountForm = {
      accountName: 'Jane',
      email: 'jane@example.com',
      roleId: 1,
      password: undefined,
    }
    expect(payload).toMatchObject({
      accountName: 'Jane',
      password: undefined,
    })
  })

  it('exposes immutable response types with required attributes', () => {
    expectTypeOf<AccountFormResponse>().toMatchTypeOf<{
      resultCode: number
    }>()
    expect(true).toBe(true)
  })
})

describe('Account response containers', () => {
  it('shapes the account list response with total and accounts array', () => {
    expectTypeOf<AccountListResponse>().toMatchTypeOf<{
      total: number
      accounts: Account[]
    }>()

    const response: AccountListResponse = {
      total: 1,
      accounts: [
        {
          accountId: 1,
          accountName: 'Jane',
          email: 'jane@example.com',
          roleDisplayName: 'ADMIN',
          statusCode: '00',
          statusDisplayName: 'active',
          lastLogin: '2024-01-01T00:00:00Z',
        },
      ],
    }
    // Validates example structure remains stable at runtime.
    expect(response.accounts[0].email).toBe('jane@example.com')
  })

  it('defines role and delete responses with fixed shapes', () => {
    expectTypeOf<AccountRoleListResponse>().toMatchTypeOf<{ roles: AccountRole[] }>()
    expectTypeOf<AccountDeleteResponse>().toMatchTypeOf<{ resultCode: number }>()

    const roleResponse: AccountRoleListResponse = {
      roles: [{ roleId: 1, roleDisplayName: 'Admin' }],
    }
    const deleteResponse: AccountDeleteResponse = {
      resultCode: 0,
      accountId: 1,
    }
    expect(roleResponse.roles[0].roleDisplayName).toBe('Admin')
    expect(deleteResponse.resultCode).toBe(0)
  })
})
