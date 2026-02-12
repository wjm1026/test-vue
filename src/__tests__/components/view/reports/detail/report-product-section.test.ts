// generated-by: ai-assist v1.0
// type: unit
// description: ReportProductSection tests verifying headings, data propagation, and reactivity.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { defineComponent, h, nextTick, ref, type PropType } from 'vue'

import ReportProductSection from '@/components/view/reports/detail/ReportProductSection.vue'
import type { ProductComments } from '@/api/types/reports'

const strengthsDataMock = ref<ProductComments[]>([])
const improvementsDataMock = ref<ProductComments[]>([])

const useReportProductSectionMock = vi.hoisted(() => {
  return vi.fn(() => ({
    strengthsData: strengthsDataMock,
    improvementsData: improvementsDataMock,
  }))
})

vi.mock('@/components/view/reports/detail/useReportProductSection', () => ({
  useReportProductSection: useReportProductSectionMock,
}))

const ElTextStub = defineComponent({
  name: 'ElText',
  setup(_, { slots }) {
    return () => h('span', { 'data-testid': 'el-text' }, slots.default ? slots.default() : [])
  },
})

const ReportCommentsTableStub = defineComponent({
  name: 'ReportCommentsTable',
  props: {
    data: {
      type: Array as PropType<ProductComments[]>,
      default: () => [],
    },
  },
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'report-comments-table',
        'data-length': String(props.data.length),
        'data-labels': props.data.map((row) => row.label).join('|'),
      })
  },
})

const sampleStrengths: ProductComments[] = [
  {
    label: '20代',
    maleComments: [
      {
        title: '味が良い',
        description: 'バランスの取れた甘さ',
        commentIds: '1001,1002',
      },
    ],
    femaleComments: [],
  },
]

const sampleImprovements: ProductComments[] = [
  {
    label: '30代',
    maleComments: [],
    femaleComments: [
      {
        title: '価格が高い',
        description: 'もう少し手頃な価格が良い',
        commentIds: '2001',
      },
    ],
  },
  {
    label: '40代',
    maleComments: [],
    femaleComments: [
      {
        title: '容量が少ない',
        description: '家族向けサイズが必要',
        commentIds: '2002',
      },
    ],
  },
]

const renderReportProductSection = () =>
  render(ReportProductSection, {
    global: {
      stubs: {
        ElText: ElTextStub,
        ReportCommentsTable: ReportCommentsTableStub,
      },
    },
  })

describe('ReportProductSection', () => {
  beforeEach(() => {
    strengthsDataMock.value = []
    improvementsDataMock.value = []
    useReportProductSectionMock.mockClear()
  })

  it('renders headings and passes strengths/improvements data to each table', () => {
    // Purpose: ensure the component renders labels and forwards composable data to table instances.
    strengthsDataMock.value = sampleStrengths
    improvementsDataMock.value = sampleImprovements

    renderReportProductSection()

    expect(useReportProductSectionMock).toHaveBeenCalledTimes(1)
    expect(screen.getByText('商品の強み')).toBeInTheDocument()
    expect(screen.getByText('商品の改善点')).toBeInTheDocument()

    const tables = screen.getAllByTestId('report-comments-table')
    expect(tables).toHaveLength(2)
    expect(tables[0].getAttribute('data-length')).toBe(String(sampleStrengths.length))
    expect(tables[0].getAttribute('data-labels')).toBe('20代')
    expect(tables[1].getAttribute('data-length')).toBe(String(sampleImprovements.length))
    expect(tables[1].getAttribute('data-labels')).toBe('30代|40代')
  })

  it('reacts to changes from the composable data sources', async () => {
    // Purpose: verify table props update when composable refs change after mount.
    renderReportProductSection()

    let tables = screen.getAllByTestId('report-comments-table')
    expect(tables[0].getAttribute('data-length')).toBe('0')
    expect(tables[1].getAttribute('data-length')).toBe('0')

    strengthsDataMock.value = sampleStrengths
    improvementsDataMock.value = sampleImprovements
    await nextTick()

    tables = screen.getAllByTestId('report-comments-table')
    expect(tables[0].getAttribute('data-length')).toBe(String(sampleStrengths.length))
    expect(tables[1].getAttribute('data-length')).toBe(String(sampleImprovements.length))
  })
})
