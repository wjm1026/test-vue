// generated-by: ai-assist v1.0
// type: unit
// description: Accounts API tests verifying request factory wiring and exposed helpers.

import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { SortOrder, pageSize } from '@/enum'
import type { AccountForm } from '@/api/types/accounts'

const listRequestSpy = vi.fn()
const detailRequestSpy = vi.fn()
const addAccountRequestSpy = vi.fn()
const roleRequestSpy = vi.fn()
const deleteAccountRequestSpy = vi.fn()
const statusRequestSpy = vi.fn()

const createApiRequestMock: Mock = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error('Unexpected request sequence')
  }),
)

const toCamelCaseKeysMock = vi.hoisted(() => vi.fn((value) => ({ __camel: value })))
const createListMockHandlerMock = vi.hoisted(() => vi.fn(() => Symbol('list-handler')))

vi.mock('@/api/request', () => ({
  createApiRequest: createApiRequestMock,
}))

vi.mock('@/util/camel-case', () => ({
  toCamelCaseKeys: toCamelCaseKeysMock,
}))

vi.mock('@/mocks/processors/mocksHandler', () => ({
  createListMockHandler: createListMockHandlerMock,
}))

describe('api/accounts', () => {
  beforeEach(() => {
    vi.resetModules()
    listRequestSpy.mockReset().mockResolvedValue('list-response')
    detailRequestSpy.mockReset().mockResolvedValue('detail-response')
    addAccountRequestSpy.mockReset().mockResolvedValue('add-response')
    roleRequestSpy.mockReset().mockResolvedValue('role-response')
    deleteAccountRequestSpy.mockReset().mockResolvedValue('delete-response')
    createApiRequestMock.mockReset()
    createListMockHandlerMock.mockReset()
    toCamelCaseKeysMock.mockReset()

    createApiRequestMock
      .mockImplementationOnce(() => listRequestSpy)
      .mockImplementationOnce(() => detailRequestSpy)
      .mockImplementationOnce(() => addAccountRequestSpy)
      .mockImplementationOnce(() => roleRequestSpy)
      .mockImplementationOnce(() => deleteAccountRequestSpy)
      .mockImplementationOnce(() => statusRequestSpy)
  })

  it('initializes account API requests with camelized fixtures', async () => {
    const module = await import('@/api/accounts')

    const accountsListJson = (await import('@/mocks/data/accounts/accountsList.json')).default
    const accountDetailJson = (await import('@/mocks/data/accounts/accountDetail.json')).default
    const accountJson = (await import('@/mocks/data/accounts/account.json')).default
    const accountRoleListJson = (await import('@/mocks/data/accounts/accountRoleList.json')).default
    const accountDeleteJson = (await import('@/mocks/data/accounts/accountDelete.json')).default
    const accountStatusJson = (await import('@/mocks/data/accounts/accountStatus.json')).default

    expect(toCamelCaseKeysMock).toHaveBeenCalledTimes(6)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(accountsListJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(accountDetailJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(accountJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(accountRoleListJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(accountDeleteJson)
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(accountStatusJson)

    expect(createListMockHandlerMock).toHaveBeenCalledWith(
      ['accountName', 'email'],
      'total',
      'accounts',
    )
    const handler = createListMockHandlerMock.mock.results[0]?.value

    expect(createApiRequestMock).toHaveBeenNthCalledWith(1, { __camel: accountsListJson }, handler)
    expect(createApiRequestMock).toHaveBeenNthCalledWith(2, { __camel: accountDetailJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(3, { __camel: accountJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(4, { __camel: accountRoleListJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(5, { __camel: accountDeleteJson })
    expect(createApiRequestMock).toHaveBeenNthCalledWith(6, { __camel: accountStatusJson })

    expect(module.getAccountList).toBeTypeOf('function')
    expect(module.getAccountDetail).toBeTypeOf('function')
    expect(module.addAccount).toBeTypeOf('function')
    expect(module.getAccountRoleList).toBeTypeOf('function')
    expect(module.deleteAccount).toBeTypeOf('function')
  })

  it('delegates to request factories for list, detail, create, and role endpoints', async () => {
    const { getAccountList, getAccountDetail, addAccount, getAccountRoleList, deleteAccount } =
      await import('@/api/accounts')

    const listParams = {
      query: '山田',
      offset: 20,
      sortKey: 'name',
      sortOrder: SortOrder.Desc,
    } as const

    const listResult = await getAccountList(listParams)
    expect(listResult).toBe('list-response')
    expect(listRequestSpy).toHaveBeenCalledWith({
      url: '/account-list',
      method: 'GET',
      params: {
        limit: pageSize,
        ...listParams,
      },
    })

    const detailResult = await getAccountDetail(1)
    expect(detailResult).toBe('detail-response')
    expect(detailRequestSpy).toHaveBeenCalledWith({
      url: '/account-detail',
      method: 'GET',
      params: {
        accountId: 1,
      },
    })

    const payload: AccountForm = {
      accountId: 1,
      accountName: '山田太郎',
      email: 'yamada@example.com',
      roleId: 1,
      password: 'secret',
    }
    const addResult = await addAccount(payload)
    expect(addResult).toBe('add-response')
    expect(addAccountRequestSpy).toHaveBeenCalledWith({
      url: '/account',
      method: 'POST',
      data: payload,
    })

    const roleResult = await getAccountRoleList()
    expect(roleResult).toBe('role-response')
    expect(roleRequestSpy).toHaveBeenCalledWith({
      url: '/account-role-list',
      method: 'GET',
    })

    const deleteResult = await deleteAccount(2)
    expect(deleteResult).toBe('delete-response')
    expect(deleteAccountRequestSpy).toHaveBeenCalledWith({
      url: '/account/2',
      method: 'DELETE',
    })
  })
})
