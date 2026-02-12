// generated-by: ai-assist v2.0
// type: unit
// description: ReportCommentsTable tests ensure composable data shaping, row spanning, and slot rendering.

import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { defineComponent, h, inject, provide } from 'vue'

import ReportCommentsTable from '@/components/view/reports/detail/ReportCommentsTable.vue'
import type { Comments, ProductComments } from '@/api/types/reports'

const tableDataKey = Symbol('table-data')
let capturedSpanMethod:
  | ((args: {
      rowIndex: number
      columnIndex: number
    }) => { rowspan: number; colspan: number } | undefined)
  | undefined

const normalizeTestId = (value?: string) => (value ?? 'column').replace(/\s+/g, '-')

const ElTableStub = defineComponent({
  name: 'ElTable',
  props: {
    data: { type: Array, default: () => [] },
    spanMethod: { type: Function, default: undefined },
  },
  setup(props, { slots }) {
    provide(tableDataKey, props)
    return () => {
      capturedSpanMethod = props.spanMethod as typeof capturedSpanMethod
      return h(
        'div',
        {
          'data-testid': 'el-table',
          'data-row-count': String(props.data.length),
        },
        slots.default ? slots.default() : [],
      )
    }
  },
})

const ElTableColumnStub = defineComponent({
  name: 'ElTableColumn',
  props: {
    prop: { type: String, default: undefined },
    label: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    const tableProps = inject<{ data: Array<Record<string, unknown>> }>(tableDataKey, { data: [] })
    return () =>
      h(
        'div',
        tableProps.data.map((row, index) => {
          const scope = { row, $index: index }
          const content = slots.default
            ? slots.default(scope)
            : String(row[props.prop as keyof typeof row] ?? '')
          return h(
            'div',
            {
              'data-testid': `cell-${normalizeTestId(props.prop ?? props.label)}-${index}`,
            },
            Array.isArray(content) ? content : (content ?? ''),
          )
        }),
      )
  },
})

const stubbedElementPlus = {
  ElTable: ElTableStub,
  ElTableColumn: ElTableColumnStub,
}

const withDisplayOrder = (comment: Comments, order?: number) =>
  ({
    ...comment,
    ...(order ? { displayOrder: order } : {}),
  }) as Comments & { displayOrder?: number }

const sampleData: ProductComments[] = [
  {
    label: '商品A',
    maleComments: [
      withDisplayOrder(
        {
          title: 'コク',
          description: '飲みごたえがある',
          commentIds: 'A001,A002',
        },
        1,
      ),
      {
        title: '香り',
        description: '後味が良い',
        commentIds: 'A010',
      },
    ],
    femaleComments: [
      withDisplayOrder(
        {
          title: 'すっきり',
          description: 'さっぱりしている',
          commentIds: 'A100',
        },
        2,
      ),
    ],
  },
  {
    label: '商品B',
    maleComments: [
      {
        title: '軽い',
        description: '日常使い向き',
        commentIds: 'B001',
      },
    ],
    femaleComments: [
      {
        title: '華やか',
        description: '香りが強い',
        commentIds: 'B010,B011',
      },
      {
        title: '甘い',
        description: 'デザートと合う',
        commentIds: 'B020',
      },
    ],
  },
]

describe('ReportCommentsTable', () => {
  it('renders transformed rows with comment ids split onto new lines', async () => {
    const { getByTestId } = render(ReportCommentsTable, {
      props: { data: sampleData },
      global: {
        stubs: stubbedElementPlus,
      },
    })

    expect(getByTestId('el-table').getAttribute('data-row-count')).toBe('4')
    // First label only appears on the first expanded row.
    expect(getByTestId('cell-label-0').textContent).toBe('商品A')
    expect(getByTestId('cell-label-1').textContent).toBe('')

    // Male display order prefix and description render together.
    const maleCell = getByTestId('cell-男性-0').textContent?.replace(/\s+/g, ' ')
    expect(maleCell).toContain('1. コク')
    expect(maleCell).toContain('飲みごたえがある')

    // Comment IDs are split with newline characters.
    expect(getByTestId('cell-maleCommentIds-0').textContent).toBe('A001,\nA002')
    expect(getByTestId('cell-femaleCommentIds-3').textContent).toBe('B020')
  })

  it('exposes span method so labels merge according to comment groups', async () => {
    render(ReportCommentsTable, {
      props: { data: sampleData },
      global: {
        stubs: stubbedElementPlus,
      },
    })

    // Root label should span the number of comment rows for 商品A (2 rows).
    expect(
      capturedSpanMethod?.({
        rowIndex: 0,
        columnIndex: 0,
      }),
    ).toEqual({
      rowspan: 2,
      colspan: 1,
    })

    // Subsequent rows should collapse the label cell.
    expect(
      capturedSpanMethod?.({
        rowIndex: 1,
        columnIndex: 0,
      }),
    ).toEqual({
      rowspan: 0,
      colspan: 0,
    })
  })

  it('renders additional-columns slot content', async () => {
    const Host = defineComponent({
      components: { ReportCommentsTable },
      setup() {
        return { sampleData }
      },
      template: `
        <ReportCommentsTable :data="sampleData">
          <template #additional-columns>
            <div data-testid="extra-column">Extra Column</div>
          </template>
        </ReportCommentsTable>
      `,
    })

    const { getByTestId } = render(Host, {
      global: {
        stubs: stubbedElementPlus,
      },
    })

    expect(getByTestId('extra-column').textContent).toBe('Extra Column')
  })
})
