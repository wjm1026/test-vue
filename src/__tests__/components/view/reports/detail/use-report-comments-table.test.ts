// generated-by: ai-assist v1.0
// type: unit
// description: useReportCommentsTable tests for row flattening and rowspan calculation.

import { describe, expect, it } from 'vitest'

import { useReportCommentsTable } from '@/components/view/reports/detail/useReportCommentsTable'
import type { ProductComments } from '@/api/types/reports'

const sampleData: ProductComments[] = [
  {
    label: '20代',
    maleComments: [
      {
        title: 'SNSで共有したい味',
        description: '映える味と香り',
        commentIds: '1001,1002',
      },
      {
        title: '手軽さが魅力',
        description: '短時間で準備できる',
        commentIds: '1003',
      },
    ],
    femaleComments: [
      {
        title: '満足感の高い食感',
        description: '外はカリッと中はホクホク',
        commentIds: '2001,2002,2003',
      },
    ],
  },
  {
    label: '30代',
    maleComments: [
      {
        title: '家族で楽しめる',
        description: '子供もお気に入り',
        commentIds: '3001',
      },
    ],
    femaleComments: [
      {
        title: '落ち着いた甘さ',
        description: '食後でも重くない',
        commentIds: '4001',
      },
      {
        title: '素材の良さが際立つ',
        description: '産地が明確で安心',
        commentIds: '4002,4003',
      },
    ],
  },
]

describe('useReportCommentsTable', () => {
  it('flattens product comments into row view models with formatted IDs', () => {
    // Purpose: ensure the composable normalizes rows and inserts newline separators.
    const { data } = useReportCommentsTable({ data: sampleData })

    expect(data.value).toEqual([
      {
        label: '20代',
        maleCommentTitle: 'SNSで共有したい味',
        maleDescription: '映える味と香り',
        maleCommentIds: '1001,\n1002',
        maleDisplayOrder: undefined,
        femaleCommentTitle: '満足感の高い食感',
        femaleDescription: '外はカリッと中はホクホク',
        femaleCommentIds: '2001,\n2002,\n2003',
        femaleDisplayOrder: undefined,
        displayOrder: undefined,
      },
      {
        label: '',
        maleCommentTitle: '手軽さが魅力',
        maleDescription: '短時間で準備できる',
        maleCommentIds: '1003',
        maleDisplayOrder: undefined,
        femaleCommentTitle: '',
        femaleDescription: '',
        femaleCommentIds: '',
        femaleDisplayOrder: undefined,
        displayOrder: undefined,
      },
      {
        label: '30代',
        maleCommentTitle: '家族で楽しめる',
        maleDescription: '子供もお気に入り',
        maleCommentIds: '3001',
        maleDisplayOrder: undefined,
        femaleCommentTitle: '落ち着いた甘さ',
        femaleDescription: '食後でも重くない',
        femaleCommentIds: '4001',
        femaleDisplayOrder: undefined,
        displayOrder: undefined,
      },
      {
        label: '',
        maleCommentTitle: '',
        maleDescription: '',
        maleCommentIds: '',
        maleDisplayOrder: undefined,
        femaleCommentTitle: '素材の良さが際立つ',
        femaleDescription: '産地が明確で安心',
        femaleCommentIds: '4002,\n4003',
        femaleDisplayOrder: undefined,
        displayOrder: undefined,
      },
    ])
  })

  it('calculates row spans for the label column and hides subsequent rows', () => {
    // Purpose: validate span method merges the first column per age group.
    const { data, objectSpanMethod } = useReportCommentsTable({ data: sampleData })

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const firstGroup = objectSpanMethod({
      row: data.value[0] as any,
      column: {} as any,
      rowIndex: 0,
      columnIndex: 0,
    })

    const hiddenRow = objectSpanMethod({
      row: data.value[1] as any,
      column: {} as any,
      rowIndex: 1,
      columnIndex: 0,
    })

    const secondGroup = objectSpanMethod({
      row: data.value[2] as any,
      column: {} as any,
      rowIndex: 2,
      columnIndex: 0,
    })
    /* eslint-enable @typescript-eslint/no-explicit-any */

    expect(firstGroup).toEqual({ rowspan: 2, colspan: 1 })
    expect(hiddenRow).toEqual({ rowspan: 0, colspan: 0 })
    expect(secondGroup).toEqual({ rowspan: 2, colspan: 1 })
  })
})
