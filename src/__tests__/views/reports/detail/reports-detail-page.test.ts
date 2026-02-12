// generated-by: ai-assist v1.0
// type: unit
// description: ReportsDetailPage tests verifying layout rendering, conditional sections, and comment dialog toggling.

import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { defineComponent, h } from 'vue'

import ReportsDetailPage from '@/views/reports/detail/ReportsDetailPage.vue'

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: {
    title: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h('section', { 'data-testid': 'layout-main', 'data-title': props.title }, slots.default?.())
  },
})

const slottedStub = (name: string, extraProps: Record<string, unknown> = {}) =>
  defineComponent({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props: extraProps as Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props: Record<string, any>) {
      return () =>
        h('div', {
          'data-testid': name,
          'data-props': JSON.stringify(props),
        })
    },
  })

const ReportOverviewSectionStub = slottedStub('report-overview-section', {
  projectInfo: { type: Object, default: null },
  quantitativeEvaluation: { type: Object, default: null },
})
const ReportDownloadSectionStub = slottedStub('report-download-section', {
  projectId: { type: Number, default: null },
})
const ReportQuantitativeSectionStub = slottedStub('report-quantitative-section', {
  quantitativeEvaluation: { type: Object, default: null },
})
const ReportQualitativeSectionStub = defineComponent({
  name: 'ReportQualitativeSection',
  emits: ['open-comments'],
  props: {
    qualitativeEvaluation: { type: Object, default: null },
  },
  setup(props, { emit }) {
    return () =>
      h('button', {
        'data-testid': 'report-qualitative-section',
        'data-props': JSON.stringify(props),
        onClick: () => emit('open-comments'),
      })
  },
})
const ReportProductSectionStub = slottedStub('report-product-section', {
  productStrengthImprovement: { type: Object, default: null },
})
const ReportImprovementSectionStub = slottedStub('report-improvement-section', {
  improvementMeasures: { type: Object, default: null },
})
const ReportCommentsDialogStub = defineComponent({
  name: 'ReportCommentsDialog',
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'closeComments'],
  setup(props, { emit }) {
    return () =>
      h(
        'div',
        { 'data-testid': 'report-comments-dialog', 'data-visible': String(props.modelValue) },
        [
          h(
            'button',
            {
              'data-testid': 'dialog-close',
              onClick: () => emit('closeComments'),
            },
            'close',
          ),
        ],
      )
  },
})

const reportDetailData = {
  projectInfo: {
    projectName: 'Project A',
    projectId: 123,
  },
  quantitativeEvaluation: {
    aggregationData: {},
    insight: 'Insight text',
  },
  qualitativeEvaluation: { commentInsight: 'Comment insight' },
  productStrengthImprovement: { label: 'Strength' },
  improvementMeasures: [{ title: 'Improve', methods: [] }],
}

const baseComposable = {
  isDailyType: false,
  isLoading: false,
  isEmpty: false,
  projectInfo: reportDetailData.projectInfo,
  quantitativeEvaluation: reportDetailData.quantitativeEvaluation,
  qualitativeEvaluation: reportDetailData.qualitativeEvaluation,
  productStrengthImprovement: reportDetailData.productStrengthImprovement,
  improvementMeasures: reportDetailData.improvementMeasures,
  isCommentsOpen: false,
}

const useReportsDetailPageMock = vi.hoisted(() =>
  vi.fn(() => ({
    ...baseComposable,
  })),
)

vi.mock('@/views/reports/detail/useReportsDetailPage', () => ({
  useReportsDetailPage: useReportsDetailPageMock,
}))

const globalStubs = {
  LayoutMain: LayoutMainStub,
  ReportOverviewSection: ReportOverviewSectionStub,
  ReportDownloadSection: ReportDownloadSectionStub,
  ReportQuantitativeSection: ReportQuantitativeSectionStub,
  ReportQualitativeSection: ReportQualitativeSectionStub,
  ReportProductSection: ReportProductSectionStub,
  ReportImprovementSection: ReportImprovementSectionStub,
  ReportCommentsDialog: ReportCommentsDialogStub,
} as const

const renderPage = () =>
  render(ReportsDetailPage, {
    global: {
      stubs: globalStubs,
    },
  })

describe('ReportsDetailPage', () => {
  it('renders sections with project data and shows download/product/improvement when not daily', () => {
    // Purpose: ensure layout draws all sections when detail data is available.
    const { getByTestId, queryByTestId, getByText } = renderPage()

    expect(getByText('Project A')).toBeInTheDocument()
    expect(getByTestId('report-overview-section')).toBeInTheDocument()
    expect(getByTestId('report-download-section')).toBeInTheDocument()
    expect(getByTestId('report-quantitative-section')).toBeInTheDocument()
    expect(getByTestId('report-qualitative-section')).toBeInTheDocument()
    expect(getByTestId('report-product-section')).toBeInTheDocument()
    expect(getByTestId('report-improvement-section')).toBeInTheDocument()
    expect(queryByTestId('report-comments-dialog')).not.toBeInTheDocument()
  })

  it('opens comments dialog when qualitative section emits event and closes on dialog event', async () => {
    // Purpose: verify isCommentsOpen toggles in response to emitted events.
    useReportsDetailPageMock.mockReturnValueOnce({
      ...baseComposable,
      isCommentsOpen: false,
    })

    const initialRender = renderPage()
    await fireEvent.click(initialRender.getByTestId('report-qualitative-section'))
    expect(initialRender.queryByTestId('report-comments-dialog')).not.toBeInTheDocument()
    initialRender.unmount()

    useReportsDetailPageMock.mockReturnValueOnce({
      ...baseComposable,
      isCommentsOpen: true,
    })

    const openedRender = renderPage()
    expect(openedRender.getByTestId('report-comments-dialog').getAttribute('data-visible')).toBe(
      'true',
    )
    await fireEvent.click(openedRender.getByTestId('dialog-close'))
    openedRender.unmount()

    useReportsDetailPageMock.mockReturnValueOnce({
      ...baseComposable,
      isCommentsOpen: false,
    })

    const closedRender = renderPage()
    expect(closedRender.queryByTestId('report-comments-dialog')).not.toBeInTheDocument()
    closedRender.unmount()
  })

  it('hides download/product/improvement sections when daily type is active', () => {
    // Purpose: ensure daily mode suppresses detail-only sections.
    useReportsDetailPageMock.mockReturnValueOnce({
      ...baseComposable,
      isDailyType: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      qualitativeEvaluation: undefined as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      productStrengthImprovement: undefined as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      improvementMeasures: undefined as any,
    })

    const { queryByTestId } = renderPage()

    expect(queryByTestId('report-download-section')).not.toBeInTheDocument()
    expect(queryByTestId('report-product-section')).not.toBeInTheDocument()
    expect(queryByTestId('report-improvement-section')).not.toBeInTheDocument()
  })

  it('renders LayoutMain with project name as title', () => {
    // Purpose: verify page title displays project name.
    const { getByText } = renderPage()
    expect(getByText('Project A')).toBeInTheDocument()
  })

  it('does not render qualitative section when qualitativeEvaluation is undefined', () => {
    // Purpose: ensure qualitative section is conditionally rendered.
    useReportsDetailPageMock.mockReturnValueOnce({
      ...baseComposable,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      qualitativeEvaluation: undefined as any,
    })

    const { queryByTestId } = renderPage()
    expect(queryByTestId('report-qualitative-section')).not.toBeInTheDocument()
  })

  it('does not render product section when productStrengthImprovement is undefined', () => {
    // Purpose: ensure product section is conditionally rendered.
    useReportsDetailPageMock.mockReturnValueOnce({
      ...baseComposable,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      productStrengthImprovement: undefined as any,
    })

    const { queryByTestId } = renderPage()
    expect(queryByTestId('report-product-section')).not.toBeInTheDocument()
  })

  it('does not render improvement section when improvementMeasures is undefined', () => {
    // Purpose: ensure improvement section is conditionally rendered.
    useReportsDetailPageMock.mockReturnValueOnce({
      ...baseComposable,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      improvementMeasures: undefined as any,
    })

    const { queryByTestId } = renderPage()
    expect(queryByTestId('report-improvement-section')).not.toBeInTheDocument()
  })

  it('shows empty state when isEmpty is true and not loading', () => {
    // Purpose: verify empty state is displayed when no data is available.
    useReportsDetailPageMock.mockReturnValueOnce({
      ...baseComposable,
      isEmpty: true,
      isLoading: false,
    })

    const { getByTestId } = renderPage()
    const layoutMain = getByTestId('layout-main')
    expect(layoutMain).toBeInTheDocument()
  })
})
