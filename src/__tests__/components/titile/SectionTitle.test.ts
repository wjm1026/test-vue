import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'

import SectionTitle from '@/components/titile/SectionTitle.vue'

describe('SectionTitle.vue', () => {
  it('renders default content when no props are provided', () => {
    render(SectionTitle)

    expect(screen.getByText('概要情報')).toBeInTheDocument()
  })

  it('renders provided content prop', () => {
    render(SectionTitle, {
      props: {
        content: '詳細情報',
      },
    })

    expect(screen.getByText('詳細情報')).toBeInTheDocument()
  })
})
