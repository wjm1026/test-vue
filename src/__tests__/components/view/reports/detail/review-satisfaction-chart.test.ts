// generated-by: ai-assist v1.0
// type: unit
// description: ReviewSatisfactionChart tests covering label display, active styling, totals, and label toggling.

import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { defineComponent, h } from 'vue'

import ReviewSatisfactionChart from '@/components/view/reports/detail/ReviewSatisfactionChart.vue'

const ElIconStub = defineComponent({
  name: 'ElIcon',
  props: {
    size: {
      type: [String, Number],
      default: undefined,
    },
  },
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'span',
        {
          'data-testid': 'el-icon',
          ...attrs,
        },
        slots.default ? slots.default() : [],
      )
  },
})

const GoodIconStub = defineComponent({
  name: 'GoodIcon',
  setup() {
    return () => h('svg', { 'data-testid': 'good-icon' })
  },
})

const BadIconStub = defineComponent({
  name: 'BadIcon',
  setup() {
    return () => h('svg', { 'data-testid': 'bad-icon' })
  },
})

const sampleData = [
  { label: '10代', good: 40, bad: 60 },
  { label: '20代', good: 70, bad: 30 },
]

const renderChart = (props?: Partial<InstanceType<typeof ReviewSatisfactionChart>['$props']>) =>
  render(ReviewSatisfactionChart, {
    props: {
      data: sampleData,
      ...props,
    },
    global: {
      stubs: {
        ElIcon: ElIconStub,
        GoodIcon: GoodIconStub,
        BadIcon: BadIconStub,
      },
    },
  })

describe('ReviewSatisfactionChart', () => {
  it('renders labels, bar widths, totals, and highlights the max item', () => {
    // Purpose: ensure chart shows labels, widths, and total metrics with custom labels.
    renderChart({
      isShowTotal: true,
      totalCount: { good: 120, bad: 45 },
      unit: '人',
      goodLabel: 'Good',
      badLabel: 'Bad',
    })

    const teenLabel = screen.getByText('10代')
    const twentiesLabel = screen.getByText('20代')
    expect(teenLabel).toBeInTheDocument()
    expect(twentiesLabel).toBeInTheDocument()
    expect(twentiesLabel.className).toContain('text-primary600')
    expect(teenLabel.className).not.toContain('text-primary600')

    const fortySpan = screen.getByText('40')
    const seventySpan = screen.getByText('70')
    expect((fortySpan.parentElement as HTMLElement).style.width).toBe('40%')
    expect((seventySpan.parentElement as HTMLElement).style.width).toBe('70%')

    expect(screen.getAllByText('Good')).toHaveLength(sampleData.length)
    expect(screen.getAllByText('Bad')).toHaveLength(sampleData.length)
    expect(screen.getAllByText('120')).toHaveLength(sampleData.length)
    expect(screen.getAllByText('45')).toHaveLength(sampleData.length)
    expect(screen.getAllByText('人').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByTestId('el-icon')).toHaveLength(sampleData.length * 2)
  })

  it('applies primary color class to the good total icon', () => {
    // Purpose: icon should inherit text-primary600 so fill uses primary color.
    renderChart({ isShowTotal: true })

    const icons = screen.getAllByTestId('el-icon')
    expect(icons[0].className).toContain('text-primary600')
  })

  it('hides labels when isShowLabel is false', () => {
    // Purpose: confirm labels can be suppressed for compact mode.
    renderChart({ isShowLabel: false })

    expect(screen.getByText('10代')).not.toBeVisible()
    expect(screen.getByText('20代')).not.toBeVisible()
  })
})
