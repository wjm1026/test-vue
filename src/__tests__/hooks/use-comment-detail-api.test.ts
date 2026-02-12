// generated-by: ai-assist v1.0
// type: unit
// description: useCommentDetailApi test verifying query key, enabled state, and fetch invocation.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const useQueryMock = vi.hoisted(() => vi.fn())
const getCommentDetailMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/comments', () => ({
  getCommentDetail: getCommentDetailMock,
}))

describe('useCommentDetailApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getCommentDetailMock.mockReset()
  })

  it('registers vue-query with comment id ref and fetcher', async () => {
    const idRef = ref(123)
    const queryResult = { data: ref(), isFetching: ref(false), refetch: vi.fn() }
    useQueryMock.mockReturnValue(queryResult)

    const module = await import('@/hooks/useCommentDetailApi')
    const result = module.useCommentDetailApi(idRef)

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const options = useQueryMock.mock.calls[0]?.[0]
    expect(options?.queryKey?.[0]).toBe('commentDetail')
    expect(typeof options?.queryFn).toBe('function')

    getCommentDetailMock.mockResolvedValue({ data: {} })
    await options?.queryFn?.()
    expect(getCommentDetailMock).toHaveBeenCalledWith(123)
    expect(options?.enabled?.()).toBe(true)

    idRef.value = 0
    expect(options?.enabled?.()).toBe(false)

    expect(result.commentDetail).toBe(queryResult.data)
    expect(result.isLoading).toBe(queryResult.isFetching)
    expect(result.refetch).toBe(queryResult.refetch)
  })
})
