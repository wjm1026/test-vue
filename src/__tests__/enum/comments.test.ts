import { describe, expect, it } from 'vitest'

import { CommentExtractType, CommentRating, CommentSortKey, CommentType } from '@/enum/comments'

describe('enum/comments', () => {
  it('exposes comment rating values', () => {
    expect(CommentRating.Good).toBe('good')
    expect(CommentRating.Bad).toBe('bad')
  })

  it('contains extract type options', () => {
    expect(Object.values(CommentExtractType)).toEqual(['unchecked', 'all', 'ng_word', 'reported'])
  })

  it('contains comment type options', () => {
    expect(Object.values(CommentType)).toEqual(['all', 'display', 'hidden', 'none'])
  })

  it('contains sortable keys', () => {
    expect(Object.values(CommentSortKey)).toEqual([
      'reviewId',
      'comment',
      'rating',
      'createdAt',
      'projectId',
      'userId',
    ])
  })
})
