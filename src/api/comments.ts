import { createApiRequest } from './request'
import type {
  CommentsListResponse,
  Comment,
  CommentDetailResponse,
  CommentListParams,
  CommentCheckStatusRequest,
  CommentCheckStatusResponse,
  CommentDisplayStatusRequest,
  CommentDisplayStatusResponse,
  CommentReplyRequest,
  CommentReplyResponse,
  CommentReplyDeleteRequest,
  CommentReplyDeleteResponse,
  CommentListCSVDownloadParams,
  CommentListCSVDownloadResponse,
} from './types/comments'

import { toCamelCaseKeys } from '@/util/camel-case'
import { CommentSortKey } from '@/enum'
import { createListMockHandler } from '@/mocks/processors/mocksHandler'
import commentsList from '@/mocks/data/comments/commentsList.json'
import commentDetail from '@/mocks/data/comments/commentDetail.json'
import commentCheckStatus from '@/mocks/data/comments/commentCheckStatus.json'
import commentDisplayStatus from '@/mocks/data/comments/commentDisplayStatus.json'
import commentReply from '@/mocks/data/comments/commentReply.json'
import commentReplyDelete from '@/mocks/data/comments/commentReplyDelete.json'

const requestCommentsList = createApiRequest<CommentsListResponse>(
  toCamelCaseKeys(commentsList),
  createListMockHandler<Comment, CommentsListResponse, 'totalCount', 'comments'>(
    ['reviewId', 'comment', 'projectId', 'userId'],
    'totalCount',
    'comments',
  ),
)

const requestCommentDetail = createApiRequest<CommentDetailResponse>(toCamelCaseKeys(commentDetail))

const requestCommentCheckStatus = createApiRequest<CommentCheckStatusResponse>(
  toCamelCaseKeys(commentCheckStatus),
)

const requestCommentDisplayStatus = createApiRequest<CommentDisplayStatusResponse>(
  toCamelCaseKeys(commentDisplayStatus),
)

const requestCommentReply = createApiRequest<CommentReplyResponse>(toCamelCaseKeys(commentReply))

const requestCommentReplyDelete = createApiRequest<CommentReplyDeleteResponse>(
  toCamelCaseKeys(commentReplyDelete),
)

const requestCommentListCSV = createApiRequest<CommentListCSVDownloadResponse>({
  code: 200,
  message: 'success',
  data: {
    blob: new Blob(
      [
        'チェック,表示,コメントID,コメント,レビュー評価,投稿日,プロジェクトID,顧客ID\n1,1,12345,"商品はとても使いやすいです。",0,2025-11-14 10:00,6789,23456\n0,0,12346,"デザインが気に入っています。",1,2025-11-13 09:30,6790,23457',
      ],
      { type: 'text/csv' },
    ),
    headers: {
      'content-disposition': 'attachment; filename="1001_20251121.csv"',
    },
  },
})

export const getCommentsList = (params: CommentListParams) =>
  requestCommentsList({
    url: '/comment-list',
    method: 'GET',
    params: {
      ...params,
      sortKey: mapSortKeyToApiFormat(params.sortKey),
    },
  })

export const getCommentDetail = (reviewId: number) =>
  requestCommentDetail({
    url: '/comment-detail',
    method: 'GET',
    params: {
      reviewId,
    },
  })

export const updateCommentCheckStatus = (data: CommentCheckStatusRequest) =>
  requestCommentCheckStatus({
    url: '/comment-check-status',
    method: 'POST',
    data,
  })

export const updateCommentDisplayStatus = (data: CommentDisplayStatusRequest) =>
  requestCommentDisplayStatus({
    url: '/comment-display-status',
    method: 'POST',
    data,
  })

export const submitCommentReply = (data: CommentReplyRequest) =>
  requestCommentReply({
    url: '/comment-reply',
    method: 'POST',
    data,
  })

export const deleteCommentReply = (data: CommentReplyDeleteRequest) =>
  requestCommentReplyDelete({
    url: '/comment-reply-delete',
    method: 'DELETE',
    data,
  })

const mapSortKeyToApiFormat = (sortKey?: CommentSortKey): string | undefined => {
  if (!sortKey) return undefined
  if (sortKey === CommentSortKey.ReviewId) return 'id'
  return sortKey
}

export const downloadCommentListCSV = (params: CommentListCSVDownloadParams) => {
  const apiParams = {
    ...params,
    sortKey: mapSortKeyToApiFormat(params.sortKey),
  }
  return requestCommentListCSV({
    url: '/comment-list-csv',
    method: 'GET',
    params: apiParams,
    responseType: 'blob',
  })
}
