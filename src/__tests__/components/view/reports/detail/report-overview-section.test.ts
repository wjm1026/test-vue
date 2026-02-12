// generated-by: ai-assist v1.0
// type: unit
// description: ReportOverviewSection tests for rendering project/product info and fallback behavior.

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'

import ReportOverviewSection from '@/components/view/reports/detail/ReportOverviewSection.vue'
import type { ProjectInfo, QuantitativeEvaluation } from '@/api/types/reportAIAnalysis'

const renderSection = (
  props: Partial<InstanceType<typeof ReportOverviewSection>['$props']> = {},
) => {
  return render(ReportOverviewSection, {
    props,
    global: {
      stubs: {
        ElText: {
          template: '<span data-testid="el-text"><slot /></span>',
        },
        BaseImage: {
          props: ['src'],
          template: '<img data-testid="base-image" :src="src" />',
        },
      },
    },
  })
}

const sampleProjectInfo: ProjectInfo = {
  projectId: 1,
  projectName: 'テストプロジェクト',
  startDate: new Date('2025-01-01T00:00:00Z'),
  endDate: new Date('2025-01-05T00:00:00Z'),
  reviewTargetStart: new Date('2024-12-01T00:00:00Z'),
  reviewTargetEnd: new Date('2024-12-31T00:00:00Z'),
  method: '店頭調査',
  productName: '有機抹茶ラテ',
  imageUrl: 'https://example.test/product.png',
  maker: 'サンプルメーカー',
  description: 'テスト商品の説明',
  updatedDate: new Date('2025-01-01T00:00:00Z'),
  reviewCount: 1234,
}

const sampleQuantitativeEvaluation = {
  aggregationData: {
    overall: {
      aggregationName: '全体',
      reviewCount: 1234,
      goodRatio: 62,
      badRatio: 38,
      goodReviewCount: 768,
      badReviewCount: 466,
    },
  },
  insight: 'overview',
} as unknown as QuantitativeEvaluation

describe('ReportOverviewSection', () => {
  it('renders formatted project and product information', () => {
    // Purpose: ensure provided props populate both overview columns.
    renderSection({
      projectInfo: sampleProjectInfo,
      quantitativeEvaluation: sampleQuantitativeEvaluation,
    })

    expect(screen.getByText(/2025[\/-]01[\/-]01\s*-\s*2025[\/-]01[\/-]05/)).toBeInTheDocument()
    expect(screen.getByText(/2024[\/-]12[\/-]01\s*-\s*2024[\/-]12[\/-]31/)).toBeInTheDocument()
    expect(screen.getAllByText('有機抹茶ラテ')).toHaveLength(2)
    expect(screen.getByText('サンプルメーカー')).toBeInTheDocument()
    expect(screen.getByText('テスト商品の説明')).toBeInTheDocument()
    expect((screen.getByTestId('base-image') as HTMLImageElement).src).toContain(
      'https://example.test/product.png',
    )
  })

  it('falls back to dashes when project info or counts are missing', () => {
    // Purpose: validate graceful degradation when props are undefined.
    renderSection()

    const fallbackValues = screen.getAllByText('-')
    expect(fallbackValues.length).toBeGreaterThan(3)
  })
})
