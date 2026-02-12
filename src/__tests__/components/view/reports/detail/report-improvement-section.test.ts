// generated-by: ai-assist v1.0
// type: unit
// description: ReportImprovementSection tests verifying sorting and fallback messaging.

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'

import ReportImprovementSection from '@/components/view/reports/detail/ReportImprovementSection.vue'
import type { ImprovementMeasures } from '@/api/types/reportAIAnalysis'

const renderSection = (
  props: Partial<InstanceType<typeof ReportImprovementSection>['$props']> = {},
) =>
  render(ReportImprovementSection, {
    props,
    global: {
      stubs: {
        ElText: {
          template: '<span data-testid="el-text"><slot /></span>',
        },
      },
    },
  })

const sampleMeasures: ImprovementMeasures = {
  improvementPoints: [
    { displayOrder: 3, title: 'パッケージ改善', detail: '箱の素材を変更' },
    { displayOrder: 1, title: '味の改善', detail: '苦味を抑える' },
    { displayOrder: 2, title: '価格調整', detail: 'セット割を追加' },
  ],
  improvementStrategies: [
    { displayOrder: 2, title: '販促施策', detail: 'SNSキャンペーン' },
    { displayOrder: 1, title: '試飲会実施', detail: '主要都市で実施' },
  ],
}

describe('ReportImprovementSection', () => {
  it('renders improvement points and strategies sorted by display order', () => {
    // Purpose: ensure both sections sort ascending regardless of input order.
    renderSection({
      improvementMeasures: sampleMeasures,
    })

    expect(screen.getByText('1. 味の改善')).toBeInTheDocument()
    expect(screen.getByText('2. 価格調整')).toBeInTheDocument()
    expect(screen.getByText('3. パッケージ改善')).toBeInTheDocument()
    expect(screen.getByText('1. 試飲会実施')).toBeInTheDocument()
    expect(screen.getByText('2. 販促施策')).toBeInTheDocument()
  })

  it('shows fallback message when no data is provided', () => {
    // Purpose: confirm columns indicate missing content.
    renderSection()

    const fallbacks = screen.getAllByText('データがありません')
    expect(fallbacks).toHaveLength(2)
  })
})
