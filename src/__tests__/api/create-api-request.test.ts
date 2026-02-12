import type { AxiosRequestConfig } from 'axios'
import { describe, it, expect, vi, afterEach } from 'vitest'

import { UseApiStub } from '@/enum'

const loadRequestModule = async (mode: UseApiStub) => {
  vi.resetModules()

  vi.doMock('@/setting/api-mode', () => ({
    useApiStub: mode,
  }))

  const apiInstanceMock = vi.fn()
  vi.doMock('@/api/api-instance', () => ({
    apiInstance: apiInstanceMock,
  }))

  const camelToSnakeMock = vi.fn()
  const toCamelCaseKeysMock = vi.fn()
  vi.doMock('@/util/camel-case', () => ({
    camelToSnake: camelToSnakeMock,
    toCamelCaseKeys: toCamelCaseKeysMock,
  }))

  const module = await import('@/api/request')

  return {
    createApiRequest: module.createApiRequest,
    apiInstanceMock,
    camelToSnakeMock,
    toCamelCaseKeysMock,
  }
}

describe('createApiRequest', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('resolves mock data immediately when env is MOCK and no filter is provided', async () => {
    // Purpose: ensure mock mode returns the provided fixture without additional processing.
    vi.useFakeTimers()

    const mockData = { status: 'ok' }
    const requestConfig: AxiosRequestConfig = { url: '/health' }
    const { createApiRequest } = await loadRequestModule(UseApiStub.TRUE)

    const request = createApiRequest(mockData)
    const mockResponse = request(requestConfig)

    await vi.advanceTimersByTimeAsync(300)
    await expect(mockResponse).resolves.toEqual(mockData) // Assertion: returns mock data as-is.
  })

  it('transforms config payloads and normalizes responses in non-mock environments', async () => {
    // Purpose: validate data/param transformations and camelCasing when calling the real API.
    const { createApiRequest, apiInstanceMock, camelToSnakeMock, toCamelCaseKeysMock } =
      await loadRequestModule(UseApiStub.FALSE)

    const config: AxiosRequestConfig = {
      url: '/users',
      method: 'post',
      data: { firstName: 'Jane' },
      params: { pageSize: 10 },
    }

    camelToSnakeMock.mockImplementation((value) => {
      if (value === config.data) return { first_name: 'Jane' }
      if (value && typeof value === 'object' && 'pageSize' in value && value.pageSize === 10) {
        return { page_size: 10 }
      }
      return value
    })

    const serverPayload = { user_name: 'jane-doe' }
    apiInstanceMock.mockResolvedValue(serverPayload)
    toCamelCaseKeysMock.mockReturnValue({ userName: 'jane-doe' })

    const request = createApiRequest({} as never)
    const result = await request(config)

    expect(camelToSnakeMock).toHaveBeenCalledTimes(2) // Assertion: converts data and params.
    expect(camelToSnakeMock).toHaveBeenCalledWith(config.data)
    expect(
      camelToSnakeMock.mock.calls.some(
        (call) =>
          call[0] &&
          typeof call[0] === 'object' &&
          'pageSize' in call[0] &&
          call[0].pageSize === 10,
      ),
    ).toBe(true) // Assertion: params are converted after filtering.
    expect(apiInstanceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/users',
        method: 'post',
        data: { first_name: 'Jane' },
        params: { page_size: 10 },
      }),
    ) // Assertion: apiInstance receives transformed payload.
    expect(toCamelCaseKeysMock).toHaveBeenCalledWith(serverPayload)
    expect(result).toEqual({ userName: 'jane-doe' }) // Assertion: response returns camelCased data.
  })

  it('propagates request errors when the underlying call fails', async () => {
    // Purpose: ensure errors from the real client surface unchanged to callers.
    const { createApiRequest, apiInstanceMock, toCamelCaseKeysMock } = await loadRequestModule(
      UseApiStub.FALSE,
    )

    const config: AxiosRequestConfig = { url: '/users/1', method: 'delete' }
    const failure = new Error('network failed')
    apiInstanceMock.mockRejectedValue(failure)

    const request = createApiRequest({} as never)

    await expect(request(config)).rejects.toBe(failure) // Assertion: forwards the rejection.
    expect(toCamelCaseKeysMock).not.toHaveBeenCalled() // Assertion: does not attempt to transform on failure.
  })

  it('removes empty values (undefined, null, empty string) from query params', async () => {
    // Purpose: ensure empty values are filtered out before sending to API.
    const { createApiRequest, apiInstanceMock, camelToSnakeMock } = await loadRequestModule(
      UseApiStub.FALSE,
    )

    const config: AxiosRequestConfig = {
      url: '/users',
      method: 'get',
      params: {
        userId: '123',
        accountId: undefined,
        reviewId: null,
        status: '',
        query: 'test',
      },
    }

    camelToSnakeMock.mockImplementation((value) => {
      if (value && typeof value === 'object') {
        return Object.fromEntries(
          Object.entries(value).map(([k, v]) => [
            k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
            v,
          ]),
        )
      }
      return value
    })

    apiInstanceMock.mockResolvedValue({ data: { users: [] } })

    const request = createApiRequest({} as never)
    await request(config)

    const callArgs = apiInstanceMock.mock.calls[0][0] as AxiosRequestConfig
    expect(callArgs.params).toBeDefined()
    expect(callArgs.params).not.toHaveProperty('accountId')
    expect(callArgs.params).not.toHaveProperty('reviewId')
    expect(callArgs.params).not.toHaveProperty('status')
    expect(callArgs.params).toHaveProperty('user_id')
    expect(callArgs.params).toHaveProperty('query')
  })

  it('returns blob response with headers when responseType is blob', async () => {
    const { createApiRequest, apiInstanceMock, camelToSnakeMock } = await loadRequestModule(
      UseApiStub.FALSE,
    )

    const blob = new Blob(['csv'])
    apiInstanceMock.mockResolvedValue({
      data: blob,
      headers: { 'content-disposition': 'file.csv' },
    })

    const config: AxiosRequestConfig = { url: '/download', method: 'get', responseType: 'blob' }
    camelToSnakeMock.mockImplementation((v) => v)

    const request = createApiRequest({} as never)
    const result = await request(config)

    expect(apiInstanceMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/download', responseType: 'blob' }),
      { returnFullResponse: true },
    )
    expect(result).toEqual({
      blob,
      headers: { 'content-disposition': 'file.csv' },
    })
  })

  it('applies filter function in mock mode and strips data wrapper', async () => {
    vi.useFakeTimers()
    const mockData = { data: { items: [1, 2, 3] } }
    const { createApiRequest } = await loadRequestModule(UseApiStub.TRUE)

    const filter = vi.fn((data: { items: number[] }, config: AxiosRequestConfig) => {
      return { items: data.items.filter((x) => x > (config.params as { min: number }).min) }
    })

    const request = createApiRequest(mockData, filter)
    const promise = request({ url: '/mock', params: { min: 1 } })
    await vi.advanceTimersByTimeAsync(300)
    const result = await promise

    expect(filter).toHaveBeenCalled()
    expect(result).toEqual({ items: [2, 3] })
  })
})
