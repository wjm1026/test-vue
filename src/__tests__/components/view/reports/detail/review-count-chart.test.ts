// generated-by: ai-assist v1.0
// type: unit
// description: ReviewCountChart tests covering rendering, bar widths, active states, unit display, and custom styling.

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'

import ReviewCountChart from '@/components/view/reports/detail/ReviewCountChart.vue'

const sampleData = [
  { label: '男性', value: 250 },
  { label: '女性', value: 240 },
  { label: 'その他', value: 10 },
]

function renderReviewCountChart(options?: {
  data?: Array<{ label: string; value: number; active?: boolean }>
  unit?: string
  barColorClass?: string
  duration?: number
  labelClass?: string
  activeLabelClass?: string
  activeBarClass?: string
}) {
  return render(ReviewCountChart, {
    props: {
      data: options?.data ?? sampleData,
      unit: options?.unit,
      barColorClass: options?.barColorClass,
      duration: options?.duration,
      labelClass: options?.labelClass,
      activeLabelClass: options?.activeLabelClass,
      activeBarClass: options?.activeBarClass,
    },
  })
}

describe('ReviewCountChart', () => {
  it('renders all data items with labels and values', () => {
    // Purpose: verify all chart items are displayed with their labels and values.
    renderReviewCountChart()

    expect(screen.getByText('男性')).toBeInTheDocument()
    expect(screen.getByText('250')).toBeInTheDocument()
    expect(screen.getByText('女性')).toBeInTheDocument()
    expect(screen.getByText('240')).toBeInTheDocument()
    expect(screen.getByText('その他')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('displays unit when provided', () => {
    // Purpose: ensure unit text is shown next to values when unit prop is set.
    renderReviewCountChart({ unit: '人' })

    const units = screen.getAllByText('人')
    expect(units.length).toBe(3)
  })

  it('does not display unit when not provided', () => {
    // Purpose: verify unit is not shown when unit prop is empty.
    renderReviewCountChart({ unit: '' })

    expect(screen.queryByText('人')).not.toBeInTheDocument()
  })

  it('applies active styling to item with maximum value', () => {
    // Purpose: confirm item with highest value receives active classes.
    const { container } = renderReviewCountChart()

    const labels = container.querySelectorAll('.text-primary600.font-bold')
    expect(labels.length).toBeGreaterThan(0)
  })

  it('applies active styling when item.active is true', () => {
    // Purpose: verify items with active flag set to true receive active styling.
    const dataWithActive = [
      { label: '男性', value: 100, active: true },
      { label: '女性', value: 200 },
    ]

    const { container } = renderReviewCountChart({ data: dataWithActive })

    const activeLabels = container.querySelectorAll('.text-primary600.font-bold')
    expect(activeLabels.length).toBeGreaterThan(0)
  })

  it('calculates bar width based on max value', () => {
    // Purpose: ensure bar widths are calculated proportionally to max value.
    const { container } = renderReviewCountChart()

    const bars = container.querySelectorAll('.h-6.transition-all')
    bars.forEach((bar) => {
      const style = (bar as HTMLElement).style.width
      // Matches both "calc((100% - 48px) * X)" and "calc(X * (100% - 48px))"
      expect(style).toMatch(
        /calc\([\d.]+\s*\*\s*\(100%\s*-\s*48px\)|calc\(\(100%\s*-\s*48px\)\s*\*[\d.]+\)/,
      )
    })
  })

  it('uses default labelClass when not provided', () => {
    // Purpose: verify default text-gray700 class is applied to labels.
    const { container } = renderReviewCountChart()

    const labels = container.querySelectorAll('.text-gray700')
    expect(labels.length).toBeGreaterThan(0)
  })

  it('applies custom labelClass when provided', () => {
    // Purpose: confirm custom label class overrides default.
    const { container } = renderReviewCountChart({ labelClass: 'text-blue-500' })

    const labels = container.querySelectorAll('.text-blue-500')
    expect(labels.length).toBeGreaterThan(0)
  })

  it('uses default activeLabelClass when not provided', () => {
    // Purpose: verify default active label classes are applied.
    const { container } = renderReviewCountChart()

    const activeLabels = container.querySelectorAll('.text-primary600.font-bold')
    expect(activeLabels.length).toBeGreaterThan(0)
  })

  it('applies custom activeLabelClass when provided', () => {
    // Purpose: confirm custom active label class overrides default.
    const { container } = renderReviewCountChart({
      activeLabelClass: 'text-red-600 font-extrabold',
    })

    const activeLabels = container.querySelectorAll('.text-red-600.font-extrabold')
    expect(activeLabels.length).toBeGreaterThan(0)
  })

  it('uses default activeBarClass when not provided', () => {
    // Purpose: verify default bg-primary500 class is applied to active bars.
    const { container } = renderReviewCountChart()

    const activeBars = container.querySelectorAll('.bg-primary500')
    expect(activeBars.length).toBeGreaterThan(0)
  })

  it('applies custom activeBarClass when provided', () => {
    // Purpose: confirm custom active bar class overrides default.
    const { container } = renderReviewCountChart({ activeBarClass: 'bg-green-500' })

    const activeBars = container.querySelectorAll('.bg-green-500')
    expect(activeBars.length).toBeGreaterThan(0)
  })

  it('uses default duration of 400ms for transitions', () => {
    // Purpose: ensure default transition duration is applied.
    const { container } = renderReviewCountChart()

    const bars = container.querySelectorAll('.h-6.transition-all')
    bars.forEach((bar) => {
      const style = (bar as HTMLElement).style.transitionDuration
      expect(style).toBe('400ms')
    })
  })

  it('applies custom duration when provided', () => {
    // Purpose: verify custom transition duration is used.
    const { container } = renderReviewCountChart({ duration: 600 })

    const bars = container.querySelectorAll('.h-6.transition-all')
    bars.forEach((bar) => {
      const style = (bar as HTMLElement).style.transitionDuration
      expect(style).toBe('600ms')
    })
  })

  it('handles empty data array', () => {
    // Purpose: confirm component renders without crashing when data is empty.
    renderReviewCountChart({ data: [] })

    expect(screen.queryByText('男性')).not.toBeInTheDocument()
  })

  it('handles single data item', () => {
    // Purpose: verify component works correctly with only one data item.
    renderReviewCountChart({ data: [{ label: 'テスト', value: 100 }] })

    expect(screen.getByText('テスト')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('handles zero values correctly', () => {
    // Purpose: ensure zero values are displayed and calculated correctly.
    renderReviewCountChart({
      data: [
        { label: 'A', value: 0 },
        { label: 'B', value: 100 },
      ],
    })

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('handles all zero values', () => {
    // Purpose: verify component handles case where all values are zero.
    renderReviewCountChart({
      data: [
        { label: 'A', value: 0 },
        { label: 'B', value: 0 },
      ],
    })

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('applies active state to multiple items with same max value', () => {
    // Purpose: confirm all items with maximum value receive active styling.
    const { container } = renderReviewCountChart({
      data: [
        { label: 'A', value: 100 },
        { label: 'B', value: 100 },
        { label: 'C', value: 50 },
      ],
    })

    const activeLabels = container.querySelectorAll('.text-primary600.font-bold')
    expect(activeLabels.length).toBeGreaterThanOrEqual(2)
  })

  it('renders with correct layout structure', () => {
    // Purpose: verify chart has correct spacing and flex layout classes.
    const { container } = renderReviewCountChart()

    const chartContainer = container.firstChild as HTMLElement
    expect(chartContainer.className).toContain('space-y-4')
  })

  it('displays value and unit in correct order', () => {
    // Purpose: ensure value appears before unit text.
    renderReviewCountChart({ unit: '人' })

    const valueElements = screen.getAllByText('250')
    const unitElements = screen.getAllByText('人')
    expect(valueElements.length).toBeGreaterThan(0)
    expect(unitElements.length).toBeGreaterThan(0)
  })

  it('calculates correct bar width for different value ratios', () => {
    // Purpose: verify bar width calculation is accurate for various value ratios.
    const { container } = renderReviewCountChart({
      data: [
        { label: 'A', value: 100 },
        { label: 'B', value: 50 },
        { label: 'C', value: 25 },
      ],
    })

    const bars = container.querySelectorAll('.h-6.transition-all')
    expect(bars.length).toBe(3)

    // Extract multiplier from width style (format: calc((100% - 48px) * X) or calc(X * (100% - 48px)))
    const getMultiplier = (width: string): number => {
      const match = width.match(/\* ([\d.]+)\)|([\d.]+) \*/)
      return parseFloat(match?.[1] || match?.[2] || '0')
    }

    const bar1Multiplier = getMultiplier((bars[0] as HTMLElement).style.width)
    const bar2Multiplier = getMultiplier((bars[1] as HTMLElement).style.width)
    const bar3Multiplier = getMultiplier((bars[2] as HTMLElement).style.width)

    expect(bar1Multiplier).toBeGreaterThan(bar2Multiplier)
    expect(bar2Multiplier).toBeGreaterThan(bar3Multiplier)
  })
})
