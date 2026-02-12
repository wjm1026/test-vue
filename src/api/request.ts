import { type AxiosRequestConfig, type AxiosResponse } from 'axios'

import { apiInstance } from './api-instance'

import { camelToSnake, toCamelCaseKeys } from '@/util/camel-case'
import { removeEmptyValues } from '@/util/object-helper'
import { useApiStub } from '@/setting/api-mode'
import { UseApiStub } from '@/enum'

/**
 * Extracts data from mock data structure.
 */
const extractMockData = <T>(mockData: T | { code?: number; message?: string; data: T }): T => {
  if (mockData && typeof mockData === 'object' && 'data' in mockData && !Array.isArray(mockData)) {
    return (mockData as { data: T }).data
  }
  return mockData as T
}

/**
 * Processes and transforms query parameters:
 * 1. Removes empty values (undefined, null, empty string)
 * 2. Converts keys and camelCase values to snake_case
 */
const processQueryParams = (params: AxiosRequestConfig['params']): AxiosRequestConfig['params'] => {
  if (!params) return undefined

  const cleanedParams = removeEmptyValues(params) as typeof params
  if (Object.keys(cleanedParams).length === 0) return undefined

  return camelToSnake(cleanedParams)
}

/**
 * Builds request config with transformed data and params.
 */
const buildRequestConfig = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const requestConfig: AxiosRequestConfig = { ...config }

  if (config.data) {
    requestConfig.data = camelToSnake(config.data)
  }

  const transformedParams = processQueryParams(config.params)
  if (transformedParams) {
    requestConfig.params = transformedParams
  }

  return requestConfig
}

/**
 * Handles blob response (for CSV downloads, etc.).
 */
const handleBlobResponse = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const requestConfig = buildRequestConfig(config)
  const response = await apiInstance<AxiosResponse>(requestConfig, {
    returnFullResponse: true,
  })

  return {
    blob: response.data as Blob,
    headers: response.headers as Record<string, string | string[] | number>,
  } as T
}

/**
 * Handles normal JSON response.
 */
const handleJsonResponse = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const requestConfig = buildRequestConfig(config)
  const response = await apiInstance<T>(requestConfig)
  return toCamelCaseKeys<T>(response)
}

/**
 * Handles mock mode response.
 */
const handleMockResponse = <T>(
  mockData: T | { code?: number; message?: string; data: T },
  filterFn: ((data: T, config: AxiosRequestConfig) => T) | undefined,
  config: AxiosRequestConfig,
): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = extractMockData(mockData)
      const result = filterFn ? filterFn(data, config) : data
      resolve(result)
    }, 300)
  })
}

export function createApiRequest<T>(
  mockData: T | { code?: number; message?: string; data: T },
  filterFn?: (data: T, config: AxiosRequestConfig) => T,
) {
  return async function request(config: AxiosRequestConfig): Promise<T> {
    if (useApiStub === UseApiStub.TRUE) {
      return handleMockResponse(mockData, filterFn, config)
    }

    if (config.responseType === 'blob') {
      return handleBlobResponse<T>(config)
    }

    return handleJsonResponse<T>(config)
  }
}
