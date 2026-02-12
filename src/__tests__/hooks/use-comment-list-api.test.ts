// generated-by: ai-assist v1.0
// type: unit
// description: useCommentListApi tests covering vue-query wiring and search reset behavior.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

const useQueryMock = vi.hoisted(() => vi.fn())
const getCommentsListMock = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/vue-query', () => ({
  useQuery: useQueryMock,
}))

vi.mock('@/api/comments', () => ({
  getCommentsList: getCommentsListMock,
}))

describe('useCommentListApi', () => {
  beforeEach(() => {
    vi.resetModules()
    useQueryMock.mockReset()
    getCommentsListMock.mockReset()
  })

  const loadComposable = async () => {
    const module = await import('@/hooks/useCommentListApi')
    return module.useCommentListApi
  }

  it('configures vue-query with provided refs and forwards to getComments', async () => {
    const offset = ref(0)
    const query = ref('initial')
    const limit = ref(6)
    const page = ref(2)
    const response = { data: {} }
    getCommentsListMock.mockResolvedValue(response)
    useQueryMock.mockReturnValue({
      data: ref(response),
      isFetching: ref(false),
    })

    const useCommentListApi = await loadComposable()
    const result = useCommentListApi({ offset, query, limit }, page)

    expect(useQueryMock).toHaveBeenCalledTimes(1)
    const options = useQueryMock.mock.calls[0]?.[0]
    expect(options?.queryKey).toEqual([
      'commentList',
      offset,
      query,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ])
    expect(typeof options?.queryFn).toBe('function')

    await options?.queryFn?.()
    expect(getCommentsListMock).toHaveBeenCalledWith({
      offset: 0,
      query: 'initial',
      limit: 6,
    })

    expect(options?.placeholderData?.('prev')).toBe('prev')
    expect(result.commentList.value).toEqual(response)
    expect(result.isLoading.value).toBe(false)
  })

  it('resets page to 1 when the search query changes', async () => {
    const offset = ref(10)
    const query = ref('foo')
    const limit = ref(6)
    const page = ref(5)
    getCommentsListMock.mockResolvedValue({ data: {} })
    useQueryMock.mockReturnValue({
      data: ref(),
      isFetching: ref(false),
    })

    const useCommentListApi = await loadComposable()
    useCommentListApi({ offset, query, limit }, page)
    const options = useQueryMock.mock.calls.at(-1)?.[0]
    expect(options?.queryKey).toEqual([
      'commentList',
      offset,
      query,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ])
    await options?.queryFn?.()
    expect(getCommentsListMock).toHaveBeenCalledWith({
      offset: 10,
      query: 'foo',
      limit: 6,
    })

    page.value = 5
    query.value = 'bar'
    await nextTick()

    expect(page.value).toBe(1)
  })
})
