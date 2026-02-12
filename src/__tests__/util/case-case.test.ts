// generated-by: ai-assist v1.0
// type: unit
// description: Unit tests for camel/snake case utilities covering nested objects and arrays.

import { describe, it, expect } from 'vitest'

import { camelToSnake, toCamelCaseKeys } from '@/util/camel-case'

describe('case-case utilities', () => {
  it('converts nested snake_case keys to camelCase', () => {
    // Purpose: ensure object trees with arrays are fully camelized.
    const input = {
      product_name: 'プレミアムコーヒー',
      maker_info: {
        company_name: 'コーヒー株式会社',
        contact_email: 'info@example.test',
      },
      tags: [
        { tag_id: 1, tag_name: '飲料' },
        { tag_id: 2, tag_name: '期間限定' },
      ],
      ratings: [5, 4, 3],
    }

    const result = toCamelCaseKeys<typeof input>(input)

    expect(result).toEqual({
      productName: 'プレミアムコーヒー',
      makerInfo: {
        companyName: 'コーヒー株式会社',
        contactEmail: 'info@example.test',
      },
      tags: [
        { tagId: 1, tagName: '飲料' },
        { tagId: 2, tagName: '期間限定' },
      ],
      ratings: [5, 4, 3],
    })
  })

  it('converts nested camelCase keys to snake_case', () => {
    // Purpose: ensure camelToSnake mirrors conversion for nested structures.
    const input = {
      productName: '有機紅茶B',
      makerInfo: {
        companyName: '紅茶ファーム',
        contactEmail: 'tea@example.test',
      },
      tags: [
        { tagId: 1, tagName: '茶葉' },
        { tagId: 2, tagName: 'オーガニック' },
      ],
    }

    const result = camelToSnake<typeof input>(input)

    expect(result).toEqual({
      product_name: '有機紅茶B',
      maker_info: {
        company_name: '紅茶ファーム',
        contact_email: 'tea@example.test',
      },
      tags: [
        { tag_id: 1, tag_name: '茶葉' },
        { tag_id: 2, tag_name: 'オーガニック' },
      ],
    })
  })

  it('returns non-object values unchanged', () => {
    // Purpose: verify primitives pass through without modifications.
    expect(toCamelCaseKeys(42)).toBe(42)
    expect(camelToSnake('value')).toBe('value')
    expect(toCamelCaseKeys(['alreadyCamel'])).toEqual(['alreadyCamel'])
  })

  it('does not convert string values for query and keyword fields', () => {
    // query: 通用搜索参数，用于各种页面的搜索框
    // keyword: 评论内容关键词搜索，用于报告详情页的评论弹窗
    const input = {
      sortKey: 'createdAt',
      query: 'aB', // User input - should NOT be converted
      keyword: 'testKeyword', // User input - should NOT be converted
      userId: 'userId', // Normal field - should be converted
    }

    const result = camelToSnake<typeof input>(input)

    expect(result).toEqual({
      sort_key: 'created_at',
      query: 'aB', // Preserved
      keyword: 'testKeyword', // Preserved
      user_id: 'user_id', // Converted
    })
  })
})
