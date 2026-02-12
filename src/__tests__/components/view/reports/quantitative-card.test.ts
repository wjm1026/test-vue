// generated-by: ai-assist v1.0
// type: unit
// description: QuantitativeCard tests for label prop/slot and default slot rendering.

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'

import QuantitativeCard from '@/components/view/reports/detail/QuantitativeCard.vue'

const renderCard = (options: Parameters<typeof render>[1] = {}) => {
  return render(QuantitativeCard, {
    ...options,
    global: {
      stubs: {
        ElText: {
          template: '<span data-testid="el-text"><slot /></span>',
        },
        ...(options.global?.stubs ?? {}),
      },
    },
  })
}

describe('QuantitativeCard', () => {
  it('renders the provided label prop when no label slot exists', () => {
    // Purpose: ensure label prop falls back to ElText rendering.
    renderCard({
      props: {
        label: '定量データ',
      },
    })

    expect(screen.getByTestId('el-text')).toHaveTextContent('定量データ')
  })

  it('renders the label slot when provided', () => {
    // Purpose: confirm slot content replaces the default label block.
    renderCard({
      props: {
        label: 'should not show',
      },
      slots: {
        label: '<p data-testid="custom-label">カスタムラベル</p>',
      },
    })

    expect(screen.getByTestId('custom-label')).toHaveTextContent('カスタムラベル')
    expect(screen.queryByText('should not show')).not.toBeInTheDocument()
  })

  it('renders default slot content inside the card body', () => {
    // Purpose: verify default slot content is projected under the label area.
    renderCard({
      slots: {
        default: '<p data-testid="body-content">内容A</p>',
      },
    })

    expect(screen.getByTestId('body-content')).toHaveTextContent('内容A')
  })
})
