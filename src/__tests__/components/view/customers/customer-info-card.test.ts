// generated-by: ai-assist v1.0
// type: unit
// description: CustomerInfoCard tests validating render output and loading directive binding.

import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { defineComponent, h } from 'vue'

import CustomerInfoCard from '@/components/view/customers/CustomerInfoCard.vue'
import type { CustomerDetail } from '@/api/types/customers'

const ElTextStub = defineComponent({
  name: 'ElText',
  setup(_, { slots }) {
    return () => h('span', slots.default ? slots.default() : [])
  },
})

const loadingDirective = vi.fn()

const baseCustomer: CustomerDetail = {
  userId: 'C-001',
  nickname: 'ニックネーム',
  ageGroup: '20代',
  gender: '女性',
  totalReviews: 15,
  totalLikes: 12345,
  status: 'public',
  updatedAt: '2024-01-01T00:00:00Z',
}

const renderCard = (props?: Partial<{ customer: CustomerDetail; isLoading: boolean }>) =>
  render(CustomerInfoCard, {
    props: {
      customer: baseCustomer,
      isLoading: false,
      ...props,
    },
    global: {
      stubs: { ElText: ElTextStub },
      directives: {
        loading: loadingDirective,
      },
    },
  })

describe('CustomerInfoCard', () => {
  beforeEach(() => {
    loadingDirective.mockReset()
  })

  it('renders customer fields and formats counts with suffix', () => {
    const { getByText, getAllByText } = renderCard()

    expect(getByText('C-001')).toBeInTheDocument()
    const nicknameTexts = getAllByText('ニックネーム')
    expect(nicknameTexts).toHaveLength(2)
    expect(nicknameTexts[1]).toBeInTheDocument()
    expect(getByText('20代')).toBeInTheDocument()
    expect(getByText('女性')).toBeInTheDocument()
    expect(getByText('15回')).toBeInTheDocument()
    expect(getByText('12,345回')).toBeInTheDocument()
  })

  it('passes isLoading value to v-loading directive', () => {
    const { getByText } = renderCard({ isLoading: true })

    const container = getByText('顧客ID').parentElement?.parentElement
      ?.parentElement as HTMLElement | null
    expect(container).toBeTruthy()
    expect(container?.classList.contains('el-loading-parent--relative')).toBe(true)
    expect(container?.querySelector('.el-loading-mask')).toBeInTheDocument()
  })
})
