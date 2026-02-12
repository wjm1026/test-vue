// generated-by: ai-assist v1.0
// type: unit
// description: Comments API tests verifying createApiRequest usage and parameter forwarding.

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CommentExtractType, CommentType, SortOrder, CommentSortKey } from '@/enum'

const createApiRequestMock = vi.hoisted(() =>
  vi.fn(() => {
    const handler = vi.fn().mockResolvedValue({})
    createdHandlers.push(handler)
    return handler
  }),
)

const createdHandlers: ReturnType<typeof vi.fn>[] = []

vi.mock('@/api/request', () => ({
  createApiRequest: createApiRequestMock,
}))

describe('comments API', () => {
  beforeEach(() => {
    vi.resetModules()
    createApiRequestMock.mockClear()
    createdHandlers.length = 0
  })

  it('calls createApiRequest for list/detail and forwards params', async () => {
    const module = await import('@/api/comments')
    const [commentsListRequest, commentDetailRequest] = createdHandlers
    commentsListRequest.mockResolvedValue({ data: [] })
    commentDetailRequest.mockResolvedValue({ data: {} })

    await module.getCommentsList({
      query: 'foo',
      offset: 10,
      limit: 20,
      extractType: CommentExtractType.All,
      commentType: CommentType.Display,
    })

    expect(commentsListRequest).toHaveBeenCalledWith({
      url: '/comment-list',
      method: 'GET',
      params: expect.objectContaining({
        query: 'foo',
        offset: 10,
        limit: 20,
        extractType: CommentExtractType.All,
        commentType: CommentType.Display,
      }),
    })

    await module.getCommentDetail(123)

    expect(commentDetailRequest).toHaveBeenCalledWith({
      url: '/comment-detail',
      method: 'GET',
      params: {
        reviewId: 123,
      },
    })
  })

  it('maps sort key for CSV download and forwards params', async () => {
    const module = await import('@/api/comments')
    const csvHandler = createdHandlers[6]
    csvHandler.mockResolvedValue({ data: { blob: new Blob() } })

    await module.downloadCommentListCSV({
      query: 'x',
      sortKey: CommentExtractType.Unchecked as never, // will be ignored
      sortOrder: SortOrder.Asc,
      extractType: CommentExtractType.Unchecked,
      commentType: CommentType.All,
    })

    expect(csvHandler).toHaveBeenCalledWith({
      url: '/comment-list-csv',
      method: 'GET',
      params: expect.objectContaining({
        query: 'x',
        sortKey: CommentExtractType.Unchecked,
      }),
      responseType: 'blob',
    })

    csvHandler.mockClear()
    await module.downloadCommentListCSV({
      query: 'x',
      offset: 0,
      limit: 10,
      sortKey: 'reviewId',
      sortOrder: 'asc',
      extractType: CommentExtractType.Unchecked,
      commentType: CommentType.All,
    } as never)

    expect(csvHandler).toHaveBeenCalledWith({
      url: '/comment-list-csv',
      method: 'GET',
      params: expect.objectContaining({
        sortKey: 'id',
      }),
      responseType: 'blob',
    })
  })

  it('handles undefined sortKey in CSV download', async () => {
    const module = await import('@/api/comments')
    const csvHandler = createdHandlers[6]
    csvHandler.mockResolvedValue({ data: { blob: new Blob() } })

    await module.downloadCommentListCSV({
      query: 'test',
      extractType: CommentExtractType.All,
      commentType: CommentType.All,
    } as never)

    expect(csvHandler).toHaveBeenCalledWith({
      url: '/comment-list-csv',
      method: 'GET',
      params: expect.objectContaining({
        query: 'test',
        sortKey: undefined,
      }),
      responseType: 'blob',
    })
  })

  it('maps other sortKey values correctly in CSV download', async () => {
    const module = await import('@/api/comments')
    const csvHandler = createdHandlers[6]
    csvHandler.mockResolvedValue({ data: { blob: new Blob() } })

    await module.downloadCommentListCSV({
      query: 'test',
      sortKey: CommentSortKey.Comment,
      sortOrder: SortOrder.Desc,
      extractType: CommentExtractType.All,
      commentType: CommentType.All,
    } as never)

    expect(csvHandler).toHaveBeenCalledWith({
      url: '/comment-list-csv',
      method: 'GET',
      params: expect.objectContaining({
        query: 'test',
        sortKey: CommentSortKey.Comment,
      }),
      responseType: 'blob',
    })

    csvHandler.mockClear()
    await module.downloadCommentListCSV({
      query: 'test',
      sortKey: CommentSortKey.Rating,
      extractType: CommentExtractType.All,
      commentType: CommentType.All,
    } as never)

    expect(csvHandler).toHaveBeenCalledWith({
      url: '/comment-list-csv',
      method: 'GET',
      params: expect.objectContaining({
        sortKey: CommentSortKey.Rating,
      }),
      responseType: 'blob',
    })
  })

  it('updates comment status and replies', async () => {
    const module = await import('@/api/comments')
    const [, , checkStatusHandler, displayStatusHandler, replyHandler, replyDeleteHandler] =
      createdHandlers

    checkStatusHandler.mockResolvedValue({ data: {} })
    displayStatusHandler.mockResolvedValue({ data: {} })
    replyHandler.mockResolvedValue({ data: {} })
    replyDeleteHandler.mockResolvedValue({ data: {} })

    await module.updateCommentCheckStatus({ reviewId: 1, check: true } as never)
    await module.updateCommentDisplayStatus({ reviewId: 1, display: true } as never)
    await module.submitCommentReply({ reviewId: 1, comment: 'ok' } as never)
    await module.deleteCommentReply({ reviewId: 1, replyId: 2 } as never)

    expect(checkStatusHandler).toHaveBeenCalledWith({
      url: '/comment-check-status',
      method: 'POST',
      data: { reviewId: 1, check: true },
    })

    expect(displayStatusHandler).toHaveBeenCalledWith({
      url: '/comment-display-status',
      method: 'POST',
      data: { reviewId: 1, display: true },
    })

    expect(replyHandler).toHaveBeenCalledWith({
      url: '/comment-reply',
      method: 'POST',
      data: { reviewId: 1, comment: 'ok' },
    })

    expect(replyDeleteHandler).toHaveBeenCalledWith({
      url: '/comment-reply-delete',
      method: 'DELETE',
      data: { reviewId: 1, replyId: 2 },
    })
  })
})
