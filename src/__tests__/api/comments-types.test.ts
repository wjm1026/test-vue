// generated-by: ai-assist v1.0
// type: unit
// description: Tests the mapping helpers in src/api/types/comments.ts.

import { describe, expect, it } from 'vitest'

import {
  mapFiltersToCommentType,
  mapSortFieldToSortKey,
  mapTabToExtractType,
} from '@/api/types/comments'
import { CommentExtractType, CommentSortKey, CommentType } from '@/enum'

describe('mapTabToExtractType', () => {
  it('maps supported tab names to extract type enums', () => {
    // Ensures each supported tab string is mapped to the expected enum member.
    const cases: Array<[string, CommentExtractType]> = [
      ['unchecked', CommentExtractType.Unchecked],
      ['all', CommentExtractType.All],
      ['ng_word', CommentExtractType.NgWord],
      ['reported', CommentExtractType.Reported],
    ]

    cases.forEach(([tab, expected]) => {
      expect(mapTabToExtractType(tab)).toBe(expected)
    })
  })

  it('returns undefined when tab is not mapped', () => {
    expect(mapTabToExtractType('archived')).toBeUndefined()
  })
})

describe('mapFiltersToCommentType', () => {
  it('returns "None" when no filters are applied', () => {
    expect(mapFiltersToCommentType([])).toBe(CommentType.None)
  })

  it('returns "All" when both visibility filters are present', () => {
    // Covers scenario where visible + hidden should broaden to all records.
    expect(mapFiltersToCommentType(['visible', 'hidden'])).toBe(CommentType.All)
  })

  it('returns "Display" when only the visible filter is present', () => {
    expect(mapFiltersToCommentType(['visible'])).toBe(CommentType.Display)
  })

  it('returns "Hidden" when only the hidden filter is present', () => {
    expect(mapFiltersToCommentType(['hidden'])).toBe(CommentType.Hidden)
  })

  it('falls back to "None" for unrelated filters', () => {
    expect(mapFiltersToCommentType(['archived'])).toBe(CommentType.None)
  })
})

describe('mapSortFieldToSortKey', () => {
  it('maps known field strings to sort key enums', () => {
    // Confirms every supported sort field is forwarded to the right enum key.
    const cases: Array<[string, CommentSortKey]> = [
      ['reviewId', CommentSortKey.ReviewId],
      ['comment', CommentSortKey.Comment],
      ['rating', CommentSortKey.Rating],
      ['createdAt', CommentSortKey.CreatedAt],
      ['projectId', CommentSortKey.ProjectId],
      ['userId', CommentSortKey.UserId],
    ]

    cases.forEach(([field, expected]) => {
      expect(mapSortFieldToSortKey(field)).toBe(expected)
    })
  })

  it('returns undefined when field is not supported', () => {
    expect(mapSortFieldToSortKey('likes')).toBeUndefined()
  })
})
