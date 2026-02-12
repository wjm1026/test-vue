import { createApiRequest } from './request'
import type { CustomerListResponse, CustomerDetailResponse } from './types/customers'

import { createListMockHandler } from '@/mocks/processors/mocksHandler'
import type { Customer } from '@/api/types/customers'
import { SortOrder, pageSize } from '@/enum'
import customerList from '@/mocks/data/customer/customerList.json'
import customerDetail from '@/mocks/data/customer/customerDetail.json'
import { toCamelCaseKeys } from '@/util/camel-case'

const requestCustomerList = createApiRequest<CustomerListResponse>(
  toCamelCaseKeys(customerList),
  createListMockHandler<Customer, CustomerListResponse, 'total', 'users'>(
    ['userId', 'nickname'],
    'total',
    'users',
  ),
)

const requestCustomerDetail = createApiRequest<CustomerDetailResponse>(
  toCamelCaseKeys(customerDetail),
)

export const getCustomerList = (params?: {
  query: string
  offset: number
  limit?: number
  sortKey: string
  sortOrder: SortOrder
  status?: string
}) =>
  requestCustomerList({
    url: '/user-list',
    method: 'GET',
    params: {
      limit: pageSize,
      ...params,
    },
  })

export const getCustomerDetail = (userId: number) =>
  requestCustomerDetail({
    url: `/user-detail`,
    method: 'GET',
    params: {
      userId,
    },
  })
