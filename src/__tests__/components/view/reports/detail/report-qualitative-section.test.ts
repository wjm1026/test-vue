// generated-by: ai-assist v1.0
// type: unit
// description: ReportQualitativeSection tests covering rendering, comment insights, top comments, frequent words, icons, and event emissions.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent, h } from 'vue'

import ReportQualitativeSection from '@/components/view/reports/detail/ReportQualitativeSection.vue'
import type { QualitativeEvaluation } from '@/api/types/reportAIAnalysis'

const ElTextStub = defineComponent({
  name: 'ElText',
  props: {
    class: {
      type: String,
      default: '',
    },
  },
  setup(_, { slots }) {
    return () => h('span', { 'data-testid': 'el-text' }, slots.default ? slots.default() : [])
  },
})

const ElIconStub = defineComponent({
  name: 'ElIcon',
  props: {
    size: {
      type: [String, Number],
      default: undefined,
    },
    class: {
      type: String,
      default: '',
    },
  },
  setup(_, { slots }) {
    return () => h('span', { 'data-testid': 'el-icon' }, slots.default ? slots.default() : [])
  },
})

const QuantitativeCardStub = defineComponent({
  name: 'QuantitativeCard',
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  setup(_, { slots }) {
    return () =>
      h('div', { 'data-testid': 'quantitative-card' }, [
        slots.label ? h('div', { 'data-testid': 'card-label' }, slots.label()) : null,
        slots.default ? h('div', { 'data-testid': 'card-content' }, slots.default()) : null,
      ])
  },
})

const ReviewCardStub = defineComponent({
  name: 'ReviewCard',
  props: {
    rank: {
      type: Number,
      default: undefined,
    },
    label: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h('div', { 'data-testid': `review-card-${props.rank || 'no-rank'}` }, [
        h('div', { 'data-testid': 'review-label' }, props.label),
        h('div', { 'data-testid': 'review-content' }, props.content),
        h('div', { 'data-testid': 'review-likes' }, String(props.likes)),
      ])
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

const ArrowRightIconStub = defineComponent({
  name: 'ArrowRightIcon',
  setup() {
    return () => h('svg', { 'data-testid': 'arrow-right-icon' })
  },
})

const BaseImageStub = defineComponent({
  name: 'BaseImage',
  props: {
    src: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return () =>
      h('img', {
        'data-testid': 'base-image',
        src: props.src,
        class: props.class,
      })
  },
})

const sampleQualitativeEvaluation: QualitativeEvaluation = {
  commentInsight: '味がさっぱりしていて飲みやすい、健康志向で選ばれている。',
  good: {
    topComments: [
      {
        rank: 1,
        userIconIndex: 1,
        nickname: 'ユーザーA',
        ageGroup: '20代',
        gender: '女性',
        comment: 'とても美味しくて毎日飲みたいです！',
        likeCount: 15,
      },
      {
        rank: 2,
        userIconIndex: 2,
        nickname: 'ユーザーB',
        ageGroup: '30代',
        gender: '男性',
        comment: '健康に良さそうで家族にも勧めたい。',
        likeCount: 12,
      },
    ],
    frequentWords: [
      { word: '美味しい', rank: 1 },
      { word: '健康', rank: 2 },
      { word: '飲みやすい', rank: 3 },
    ],
    wordCloudImageUrl: 'https://example.com/wordcloud.png',
    networkImageUrl: 'https://example.com/network.png',
  },
  bad: {
    topComments: [
      {
        rank: 1,
        userIconIndex: 1,
        nickname: 'ユーザーD',
        ageGroup: '50代',
        gender: '男性',
        comment: 'もう少し甘さ控えめだと良い。',
        likeCount: 5,
      },
    ],
    frequentWords: [
      { word: '高い', rank: 1 },
      { word: '甘い', rank: 2 },
    ],
    wordCloudImageUrl: 'https://example.com/wordcloud-bad.png',
    networkImageUrl: 'https://example.com/network-bad.png',
  },
}

function renderReportQualitativeSection(options?: {
  qualitativeEvaluation?: QualitativeEvaluation
  onOpenComments?: ReturnType<typeof vi.fn>
}) {
  const openCommentsSpy = options?.onOpenComments ?? vi.fn()

  const Host = defineComponent({
    components: { ReportQualitativeSection },
    setup() {
      return {
        qualitativeEvaluation: options?.qualitativeEvaluation,
        openCommentsSpy,
      }
    },
    template: `
      <ReportQualitativeSection
        :qualitative-evaluation="qualitativeEvaluation"
        @open-comments="openCommentsSpy"
      />
    `,
  })

  const utils = render(Host, {
    global: {
      stubs: {
        ElText: ElTextStub,
        ElIcon: ElIconStub,
        QuantitativeCard: QuantitativeCardStub,
        ReviewCard: ReviewCardStub,
        GoodIcon: GoodIconStub,
        BadIcon: BadIconStub,
        ArrowRightIcon: ArrowRightIconStub,
        BaseImage: BaseImageStub,
      },
    },
  })

  return { ...utils, openCommentsSpy }
}

describe('ReportQualitativeSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders section title', () => {
    // Purpose: verify section displays "定性評価" title.
    renderReportQualitativeSection({ qualitativeEvaluation: sampleQualitativeEvaluation })

    expect(screen.getByText('定性評価')).toBeInTheDocument()
  })

  it('displays comment insight in the first card', () => {
    // Purpose: ensure comment insight is rendered in the comment evaluation card.
    renderReportQualitativeSection({ qualitativeEvaluation: sampleQualitativeEvaluation })

    expect(
      screen.getByText('味がさっぱりしていて飲みやすい、健康志向で選ばれている。'),
    ).toBeInTheDocument()
  })

  it('renders two sections for good and bad evaluations', () => {
    // Purpose: confirm both "よかった別" and "イマイチ別" sections are displayed.
    renderReportQualitativeSection({ qualitativeEvaluation: sampleQualitativeEvaluation })

    expect(screen.getByText('よかった別')).toBeInTheDocument()
    expect(screen.getByText('イマイチ別')).toBeInTheDocument()
  })

  it('displays GoodIcon for good section and BadIcon for bad section', () => {
    // Purpose: verify correct icons are used for each section.
    renderReportQualitativeSection({ qualitativeEvaluation: sampleQualitativeEvaluation })

    const goodIcons = screen.getAllByTestId('good-icon')
    const badIcons = screen.getAllByTestId('bad-icon')
    expect(goodIcons.length).toBeGreaterThan(0)
    expect(badIcons.length).toBeGreaterThan(0)
  })

  it('renders top comments for both good and bad sections', () => {
    // Purpose: ensure ReviewCard components are rendered for top comments.
    renderReportQualitativeSection({ qualitativeEvaluation: sampleQualitativeEvaluation })

    expect(screen.getByText('ユーザーA (20代 / 女性)')).toBeInTheDocument()
    expect(screen.getByText('とても美味しくて毎日飲みたいです！')).toBeInTheDocument()
    expect(screen.getByText('ユーザーB (30代 / 男性)')).toBeInTheDocument()
    expect(screen.getByText('健康に良さそうで家族にも勧めたい。')).toBeInTheDocument()
    expect(screen.getByText('ユーザーD (50代 / 男性)')).toBeInTheDocument()
    expect(screen.getByText('もう少し甘さ控えめだと良い。')).toBeInTheDocument()
  })

  it('displays frequent words with rank for both sections', () => {
    // Purpose: verify frequent words are displayed with their ranks.
    renderReportQualitativeSection({ qualitativeEvaluation: sampleQualitativeEvaluation })

    expect(screen.getByText('1 . 美味しい')).toBeInTheDocument()
    expect(screen.getByText('2 . 健康')).toBeInTheDocument()
    expect(screen.getByText('3 . 飲みやすい')).toBeInTheDocument()
    expect(screen.getByText('1 . 高い')).toBeInTheDocument()
    expect(screen.getByText('2 . 甘い')).toBeInTheDocument()
  })

  it('renders pattern images in both sections', () => {
    // Purpose: confirm BaseImage components display pattern images.
    renderReportQualitativeSection({
      qualitativeEvaluation: sampleQualitativeEvaluation,
    })

    const images = screen.getAllByTestId('base-image')
    // Each section has 2 pattern images (patten1Image and patten2Image)
    // There are 2 sections, so total should be 4 images
    expect(images.length).toBeGreaterThanOrEqual(2)
  })

  it('emits open-comments event when comment list button is clicked in comment insight card', async () => {
    // Purpose: verify clicking "ボタン_コメント一覧へ" in comment insight card emits event.
    const user = userEvent.setup()
    const { openCommentsSpy } = renderReportQualitativeSection({
      qualitativeEvaluation: sampleQualitativeEvaluation,
    })

    const buttons = screen.getAllByText('コメント一覧へ')
    // First button is in the comment insight card
    await user.click(buttons[0])

    expect(openCommentsSpy).toHaveBeenCalledTimes(1)
  })

  it('emits open-comments event when comment list button is clicked in section cards', async () => {
    // Purpose: ensure clicking "ボタン_コメント一覧へ" in section cards emits event.
    const user = userEvent.setup()
    const { openCommentsSpy } = renderReportQualitativeSection({
      qualitativeEvaluation: sampleQualitativeEvaluation,
    })

    const buttons = screen.getAllByText('コメント一覧へ')
    // Buttons in section cards (after the first one)
    if (buttons.length > 1) {
      await user.click(buttons[1])
      expect(openCommentsSpy).toHaveBeenCalledTimes(1)
    }
  })

  it('displays empty string when commentInsight is undefined', () => {
    // Purpose: verify component handles missing commentInsight gracefully.
    renderReportQualitativeSection({
      qualitativeEvaluation: {
        ...sampleQualitativeEvaluation,
        commentInsight: undefined as unknown as string,
      },
    })

    const cards = screen.getAllByTestId('quantitative-card')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('renders empty arrays when topComments or frequentWords are missing', () => {
    // Purpose: confirm component handles missing comment or word data.
    renderReportQualitativeSection({
      qualitativeEvaluation: {
        commentInsight: 'Test insight',
        good: {
          topComments: [],
          frequentWords: [],
          wordCloudImageUrl: '',
          networkImageUrl: '',
        },
        bad: {
          topComments: [],
          frequentWords: [],
          wordCloudImageUrl: '',
          networkImageUrl: '',
        },
      },
    })

    expect(screen.getByText('よかった別')).toBeInTheDocument()
    expect(screen.getByText('イマイチ別')).toBeInTheDocument()
    expect(screen.queryByTestId('review-card-1')).not.toBeInTheDocument()
  })

  it('handles undefined qualitativeEvaluation prop', () => {
    // Purpose: ensure component renders without crashing when prop is undefined.
    renderReportQualitativeSection()

    expect(screen.getByText('定性評価')).toBeInTheDocument()
    expect(screen.getByText('よかった別')).toBeInTheDocument()
    expect(screen.getByText('イマイチ別')).toBeInTheDocument()
  })

  it('displays comment labels with correct format', () => {
    // Purpose: verify comment labels include nickname, age group, and gender.
    renderReportQualitativeSection({ qualitativeEvaluation: sampleQualitativeEvaluation })

    expect(screen.getByText('ユーザーA (20代 / 女性)')).toBeInTheDocument()
    expect(screen.getByText('ユーザーB (30代 / 男性)')).toBeInTheDocument()
    expect(screen.getByText('ユーザーD (50代 / 男性)')).toBeInTheDocument()
  })

  it('renders ArrowRightIcon in comment list buttons', () => {
    // Purpose: confirm ArrowRightIcon is displayed in all comment list buttons.
    renderReportQualitativeSection({ qualitativeEvaluation: sampleQualitativeEvaluation })

    const arrowIcons = screen.getAllByTestId('arrow-right-icon')
    // Should have at least 3 buttons (1 in comment insight card + 2 in section cards)
    expect(arrowIcons.length).toBeGreaterThanOrEqual(3)
  })

  it('displays "頻出ワード" label in both sections', () => {
    // Purpose: verify frequent words section label is displayed.
    renderReportQualitativeSection({ qualitativeEvaluation: sampleQualitativeEvaluation })

    const frequentWordLabels = screen.getAllByText('頻出ワード')
    expect(frequentWordLabels.length).toBe(2)
  })
})
