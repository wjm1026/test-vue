import { type AxiosRequestConfig } from 'axios'
import dayjs from 'dayjs'

import { SortOrder, defaultPage, pageSize } from '@/enum'

export type ListQueryParams<T> = {
  name?: string
  page?: number
  pageSize?: number
  limit?: number
  offset?: number
  query?: string
  sortKey?: keyof T
  sortOrder?: SortOrder
  sortField?: keyof T
  startDate?: string
  endDate?: string
}

export const textFilter = <T>(data: T[], keyword: string, keys: keyof T | Array<keyof T>) => {
  const searchKeys = Array.isArray(keys) ? keys : [keys]
  const lowerKeyword = keyword.toLowerCase()
  return data.filter((item) =>
    searchKeys.some((key) => String(item[key]).toLowerCase().includes(lowerKeyword)),
  )
}

export const paginate = <T>(data: T[], page = defaultPage, size = pageSize) => {
  const start = (page - 1) * size
  const end = page * size
  return data.slice(start, end)
}

export const dataSort = <T>(data: T[], sortField?: keyof T, sortOrder: 'asc' | 'desc' = 'asc') => {
  if (!sortField) return data
  return [...data].sort((a, b) => {
    const valA = a[sortField]
    const valB = b[sortField]

    if (valA === valB) return 0

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === SortOrder.Asc ? valA - valB : valB - valA
    }

    return sortOrder === SortOrder.Asc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA))
  })
}

export const createListMockHandler = <
  T,
  U extends Record<ListKey | TotalKey, unknown>,
  TotalKey extends keyof U,
  ListKey extends keyof U,
>(
  keyForFilter: keyof T | Array<keyof T>,
  totalKey: TotalKey,
  listKey: ListKey,
  options?: {
    startDateField?: keyof T
    endDateField?: keyof T
  },
) => {
  return (response: U, config: AxiosRequestConfig): U => {
    const { params = {} as ListQueryParams<T> } = config
    const list = response[listKey] as T[]

    let filtered = list
    if (params.query) {
      filtered = textFilter(filtered, params.query, keyForFilter)
    }

    if (
      (params.startDate || params.endDate) &&
      (options?.startDateField || options?.endDateField)
    ) {
      filtered = filtered.filter((item) => {
        const itemStartDateValue = options.startDateField ? item[options.startDateField] : null
        const itemEndDateValue = options.endDateField ? item[options.endDateField] : null

        if (!itemStartDateValue && !itemEndDateValue) return true

        const itemStartDate = itemStartDateValue ? dayjs(String(itemStartDateValue)) : null
        const itemEndDate = itemEndDateValue ? dayjs(String(itemEndDateValue)) : null
        const filterStartDate = params.startDate ? dayjs(params.startDate) : null
        const filterEndDate = params.endDate ? dayjs(params.endDate) : null

        if (filterStartDate && itemEndDate && itemEndDate.isBefore(filterStartDate, 'day')) {
          return false
        }
        if (filterEndDate && itemStartDate && itemStartDate.isAfter(filterEndDate, 'day')) {
          return false
        }

        return true
      })
    }

    filtered = dataSort(
      filtered,
      (params.sortKey ?? params.sortField) as keyof T | undefined,
      params.sortOrder ?? SortOrder.Asc,
    )

    const size = Number(params.limit ?? params.pageSize ?? pageSize)
    const page =
      params.offset !== undefined
        ? Math.floor((Number(params.offset) || 0) / size) + 1
        : Number(params.page ?? defaultPage)
    const pagedData = paginate(filtered, page, size)
    return {
      ...response,
      [totalKey]: filtered.length,
      [listKey]: pagedData,
    } as U
  }
}
