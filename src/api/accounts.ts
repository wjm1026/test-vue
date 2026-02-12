import { createApiRequest } from './request'
import type {
  Account,
  AccountDetailResponse,
  AccountListResponse,
  AccountForm,
  AccountFormResponse,
  AccountRoleListResponse,
  AccountDeleteResponse,
  AccountStatus,
  AccountStatusResponse,
} from './types/accounts'

import { createListMockHandler } from '@/mocks/processors/mocksHandler'
import { SortOrder, pageSize } from '@/enum'
import accountsList from '@/mocks/data/accounts/accountsList.json'
import accountDetail from '@/mocks/data/accounts/accountDetail.json'
import accountForm from '@/mocks/data/accounts/account.json'
import accountRoleList from '@/mocks/data/accounts/accountRoleList.json'
import accountDelete from '@/mocks/data/accounts/accountDelete.json'
import accountStatus from '@/mocks/data/accounts/accountStatus.json'
import { toCamelCaseKeys } from '@/util/camel-case'

const requestAccountList = createApiRequest<AccountListResponse>(
  toCamelCaseKeys(accountsList),
  createListMockHandler<Account, AccountListResponse, 'total', 'accounts'>(
    ['accountName', 'email'],
    'total',
    'accounts',
  ),
)

const requestAccountDetail = createApiRequest<AccountDetailResponse>(toCamelCaseKeys(accountDetail))

const requestAccountForm = createApiRequest<AccountFormResponse>(toCamelCaseKeys(accountForm))

const requestAccountRoleList = createApiRequest<AccountRoleListResponse>(
  toCamelCaseKeys(accountRoleList),
)

const requestAccountDelete = createApiRequest<AccountDeleteResponse>(toCamelCaseKeys(accountDelete))

const requestAccountStatus = createApiRequest<AccountStatusResponse>(toCamelCaseKeys(accountStatus))

export const getAccountList = (params?: {
  query: string
  offset: number
  limit?: number
  sortKey: string
  sortOrder: SortOrder
}) =>
  requestAccountList({
    url: '/account-list',
    method: 'GET',
    params: {
      limit: pageSize,
      ...params,
    },
  })

export const getAccountDetail = (accountId: number) =>
  requestAccountDetail({
    url: `/account-detail`,
    method: 'GET',
    params: {
      accountId,
    },
  })

export const addAccount = (data: AccountForm) =>
  requestAccountForm({
    url: '/account',
    method: 'POST',
    data,
  })

export const getAccountRoleList = () =>
  requestAccountRoleList({
    url: '/account-role-list',
    method: 'GET',
  })

export const deleteAccount = (accountId: number) =>
  requestAccountDelete({
    url: `/account/${accountId}`,
    method: 'DELETE',
  })

export const updateStatus = (data: AccountStatus) =>
  requestAccountStatus({
    url: '/account-status',
    method: 'POST',
    data,
  })
