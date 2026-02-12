// generated-by: ai-assist v1.0
// type: unit
// description: ReviewCard tests verifying rank icon selection, avatar image, conditional padding, and formatting.

import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { defineComponent, h } from 'vue'

import ReviewCard from '@/components/view/reports/detail/ReviewCard.vue'

function createIconStub(testId: string) {
  return defineComponent({
    name: `Stub${testId}`,
    setup() {
      return () => h('span', { 'data-testid': testId })
    },
  })
}

vi.mock('@/components/icon/RankOneIcon.vue', () => ({ default: createIconStub('rank-one-icon') }))
vi.mock('@/components/icon/RankTwoIcon.vue', () => ({ default: createIconStub('rank-two-icon') }))
vi.mock('@/components/icon/RankThreeIcon.vue', () => ({
  default: createIconStub('rank-three-icon'),
}))
vi.mock('@/components/icon/HeartIcon.vue', () => ({ default: createIconStub('heart-icon') }))

vi.mock('@/shared/avatars', () => ({
  avatars: [
    '/avatar0.png',
    '/avatar1.png',
    '/avatar2.png',
    '/avatar3.png',
    '/avatar4.png',
    '/avatar5.png',
  ],
}))

const ElIconStub = defineComponent({
  name: 'ElIcon',
  props: {
    size: {
      type: [String, Number],
      default: undefined,
    },
  },
  setup(_, { slots }) {
    return () => h('span', { 'data-testid': 'el-icon' }, slots.default ? slots.default() : [])
  },
})

const renderCard = (props: Partial<InstanceType<typeof ReviewCard>['$props']>) =>
  render(ReviewCard, {
    props: {
      label: 'ユーザーA',
      content: 'コメント本文',
      likes: 12345,
      ...props,
    },
    global: {
      stubs: {
        ElIcon: ElIconStub,
      },
    },
  })

describe('ReviewCard', () => {
  it('renders rank icon, avatar image, and formatted likes when rank is provided', () => {
    // Purpose: ensure rank-specific styling and formatting appear when rank exists.
    const { container } = renderCard({ rank: 1, userIconIndex: 0 })

    expect(screen.getByText('ユーザーA')).toBeInTheDocument()
    expect(screen.getByText('コメント本文')).toBeInTheDocument()
    expect(screen.getByText('12,345')).toBeInTheDocument()
    expect(screen.getByText('参考になった')).toBeInTheDocument()
    expect(screen.getByTestId('rank-one-icon')).toBeInTheDocument()
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument()
    expect(container.firstElementChild?.className).toContain('pl-10')
  })

  it('selects alternate rank icon when rank modulo cycles to third icon', () => {
    // Purpose: verify rank index computation (% 3) drives icon selection.
    renderCard({ rank: 3, userIconIndex: 2 })

    expect(screen.getByTestId('rank-three-icon')).toBeInTheDocument()
  })

  it('hides rank icon and padding when rank is absent', () => {
    // Purpose: confirm layout collapses when rank is undefined.
    const { container } = renderCard({ rank: undefined })

    expect(screen.queryByTestId('rank-one-icon')).not.toBeInTheDocument()
    expect(container.firstElementChild?.className).not.toContain('pl-10')
  })
})
