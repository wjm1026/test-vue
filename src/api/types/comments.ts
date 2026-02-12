import type { ComputedRef, Ref } from 'vue'

import { CommentExtractType, CommentRating, CommentSortKey, CommentType, SortOrder } from '@/enum'

// Entity Types
export interface Comment {
  reviewId: number
  comment: string
  rating: number
  createdAt: string
  checkFlag: number
  displayFlag: number
  projectId: number
  userId: number
  userIconIndex: number
  nickname: string
  ageGroup: string
  gender: string
  likeCount: number
}

export interface CommentDetail {
  reviewId: number
  comment: string
  reply: string
  rating: number
  createdAt: string
  displayFlag: number
  projectId: number
  userId: number
  productName: string
  nickName: string
  imageUrl?: string
}

// Request Types

export type CommentListParams = {
  query?: string
  userId?: number
  keyword?: string
  rating?: CommentRating
  extractType?: CommentExtractType
  commentType?: CommentType
  sortKey?: CommentSortKey
  sortOrder?: SortOrder
  limit: number
  offset: number
}

export interface CommentCheckStatusRequest {
  reviewIdList: number[]
  checkFlag: number
}

export type CommentDisplayStatusIdType = 'comment' | 'user'

export interface CommentDisplayStatusRequest {
  idType: CommentDisplayStatusIdType
  targetId: number
  displayFlag: number
}

export interface CommentReplyRequest {
  reviewId: number
  reply: string
}

export interface CommentReplyDeleteRequest {
  reviewId: number
}

// Response Types

export type CommentsListResponse = {
  totalCount: number
  comments: Comment[]
}

export type CommentDetailResponse = CommentDetail

export interface CommentCheckStatusResult {
  reviewId: number
  checkFlag: number
}

export type CommentCheckStatusResponse = {
  statusList: CommentCheckStatusResult[]
}

export type CommentDisplayStatusResponse = {
  targetId: number
  displayFlag: number
}

export type CommentReplyResponse = {
  reply: string
}

export type CommentReplyDeleteResponse = {
  resultCode: number
}

export type CommentListCSVDownloadParams = {
  query?: string
  extractType?: CommentExtractType
  commentType?: CommentType
  sortKey?: CommentSortKey
  sortOrder?: SortOrder
}

export type CommentListCSVDownloadResponse = {
  blob: Blob
  headers: Record<string, string | string[] | number>
}

// Utility Types

type ToRefs<T> = {
  [K in keyof T]?: ComputedRef<T[K]> | Ref<T[K]>
}

export type CommentListParamsRefs = ToRefs<CommentListParams> & {
  limit: ComputedRef<number> | Ref<number>
  offset: ComputedRef<number> | Ref<number>
}

// Utility Functions

export const mapTabToExtractType = (tab: string): CommentExtractType | undefined => {
  const mapping: Record<string, CommentExtractType> = {
    unchecked: CommentExtractType.Unchecked,
    all: CommentExtractType.All,
    ng_word: CommentExtractType.NgWord,
    reported: CommentExtractType.Reported,
  }
  return mapping[tab]
}

export const mapFiltersToCommentType = (filters: string[]): CommentType | undefined => {
  if (filters.length === 0) return CommentType.None
  if (filters.includes('visible') && filters.includes('hidden')) return CommentType.All
  if (filters.includes('visible')) return CommentType.Display
  if (filters.includes('hidden')) return CommentType.Hidden
  return CommentType.None
}

export const mapSortFieldToSortKey = (field: string): CommentSortKey | undefined => {
  const mapping: Record<string, CommentSortKey> = {
    reviewId: CommentSortKey.ReviewId,
    comment: CommentSortKey.Comment,
    rating: CommentSortKey.Rating,
    createdAt: CommentSortKey.CreatedAt,
    projectId: CommentSortKey.ProjectId,
    userId: CommentSortKey.UserId,
  }
  return mapping[field]
}
