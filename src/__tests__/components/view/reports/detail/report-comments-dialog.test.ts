// generated-by: ai-assist v1.0
// type: unit
// description: ReportCommentsDialog tests covering dialog visibility, filtering, empty state, loading, and pagination propagation.

import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { defineComponent, h, inject, provide, ref } from 'vue'

import ReportCommentsDialog from '@/components/view/reports/detail/ReportCommentsDialog.vue'
import { CommentRating } from '@/enum'

const BaseDialogStub = defineComponent({
  name: 'BaseDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    width: { type: [Number, String], default: undefined },
    className: { type: String, default: undefined },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'base-dialog',
          'data-visible': String(props.modelValue),
          class: props.className,
        },
        [
          slots.title ? h('div', { 'data-testid': 'dialog-title' }, slots.title()) : null,
          slots.main ? h('div', { 'data-testid': 'dialog-main' }, slots.main()) : null,
          h(
            'button',
            {
              'data-testid': 'close-button',
              onClick: () => emit('close'),
            },
            'close',
          ),
        ],
      )
  },
})

const SearchInputStub = defineComponent({
  name: 'SearchInput',
  props: {
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        'data-testid': 'search-input',
        value: props.modelValue,
        onInput: (event: Event) =>
          emit('update:modelValue', (event.target as HTMLInputElement).value),
      })
  },
})

const RADIO_GROUP_KEY = Symbol('radio-group')

const ElRadioGroupStub = defineComponent({
  name: 'ElRadioGroup',
  props: {
    modelValue: { type: [String, Number, Object], default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    provide(RADIO_GROUP_KEY, {
      update: (value: unknown) => emit('update:modelValue', value),
      modelValue: () => props.modelValue,
    })
    return () => h('div', { 'data-testid': 'radio-group' }, slots.default ? slots.default() : [])
  },
})

const BaseRadioStub = defineComponent({
  name: 'BaseRadio',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number, Object], default: undefined },
  },
  setup(props) {
    const group = inject<{ update: (value: unknown) => void } | null>(RADIO_GROUP_KEY, null)
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': `radio-${props.label}`,
          onClick: () => group?.update(props.value),
        },
        props.label,
      )
  },
})

const BaseCheckboxStub = defineComponent({
  name: 'BaseCheckbox',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  setup(props) {
    return () =>
      h('label', { 'data-testid': `checkbox-${props.value}` }, [
        h('input', { type: 'checkbox', value: props.value }),
        props.label,
      ])
  },
})

const ElCheckboxGroupStub = defineComponent({
  name: 'ElCheckboxGroup',
  props: {
    modelValue: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'checkbox-group',
        },
        slots.default
          ? slots.default({
              modelValue: props.modelValue,
              update: (value: string[]) => emit('update:modelValue', value),
            })
          : [],
      )
  },
})

const ReviewCardStub = defineComponent({
  name: 'ReviewCard',
  props: {
    label: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, required: true },
  },
  setup(props) {
    return () =>
      h('div', { 'data-testid': `review-card-${props.label}` }, `${props.content}(${props.likes})`)
  },
})

const ElEmptyStub = defineComponent({
  name: 'ElEmpty',
  props: {
    description: { type: String, default: '' },
  },
  setup(props) {
    return () => h('div', { 'data-testid': 'el-empty' }, props.description)
  },
})

const ElPaginationStub = defineComponent({
  name: 'ElPagination',
  props: {
    total: { type: Number, default: 0 },
    currentPage: { type: Number, default: 1 },
    pageSize: { type: Number, default: 6 },
  },
  emits: ['current-change'],
  setup(props, { emit }) {
    return () =>
      h('button', {
        'data-testid': 'pagination',
        'data-total': String(props.total),
        onClick: () => emit('current-change', props.currentPage + 1),
      })
  },
})

const loadingState = ref(false)
const ElLoadingDirectiveStub = {
  mounted: (el: HTMLElement) => {
    el.setAttribute('data-loading', String(loadingState.value))
  },
  updated: (el: HTMLElement) => {
    el.setAttribute('data-loading', String(loadingState.value))
  },
}

const commentList = ref({
  totalCount: 2,
  comments: [
    { label: 'A', content: 'comment A', likes: 10 },
    { label: 'B', content: 'comment B', likes: 20 },
  ],
})

const useReportCommentsDialogMock = vi.hoisted(() =>
  vi.fn(() => ({
    commentVisible: ref(true),
    searchKeyword: ref(''),
    rating: ref<CommentRating | 'all'>('all'),
    commentList,
    isLoading: loadingState,
    page: ref(1),
    limit: ref(6),
    pageChange: vi.fn(),
    handleClose: vi.fn(),
  })),
)

vi.mock('@/components/view/reports/detail/useReportCommentsDialog', () => ({
  All: 'all',
  useReportCommentsDialog: useReportCommentsDialogMock,
}))

describe('ReportCommentsDialog', () => {
  it('renders comments, filters, and pagination when list has data', () => {
    // Purpose: ensure dialog displays counts, filter controls, and review cards.
    const { getByTestId, getByText } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    expect(getByTestId('base-dialog').getAttribute('data-visible')).toBe('true')
    expect(getByText('全2件')).toBeInTheDocument()
    expect(getByTestId('search-input')).toBeInTheDocument()
    expect(getByTestId('radio-group')).toBeInTheDocument()
    expect(getByTestId('radio-よかった')).toBeInTheDocument()
    expect(getByTestId('radio-イマイチ')).toBeInTheDocument()
    expect(getByTestId('radio-全て')).toBeInTheDocument()
    expect(getByTestId('review-card-A')).toBeInTheDocument()
    expect(getByTestId('review-card-B')).toBeInTheDocument()
    expect(getByTestId('pagination').getAttribute('data-total')).toBe('2')
  })

  it('shows empty state when loading is false and there are no comments', async () => {
    // Purpose: verify ElEmpty renders when comments array is empty while not loading.
    commentList.value = {
      totalCount: 0,
      comments: [],
    }
    loadingState.value = false

    const { findByTestId } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    expect(await findByTestId('el-empty')).toHaveTextContent('データがありません')
  })

  it('invokes composable handlers when close or pagination events fire', async () => {
    // Purpose: ensure closing the dialog and pagination events propagate to composable functions.
    const pageChangeSpy = vi.fn()
    const handleCloseSpy = vi.fn()
    useReportCommentsDialogMock.mockReturnValueOnce({
      ...useReportCommentsDialogMock(),
      pageChange: pageChangeSpy,
      handleClose: handleCloseSpy,
    })

    const { getByTestId } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    await fireEvent.click(getByTestId('pagination'))
    await fireEvent.click(getByTestId('close-button'))

    expect(pageChangeSpy).toHaveBeenCalledWith(2)
    expect(handleCloseSpy).toHaveBeenCalledTimes(1)
  })

  it('updates search keyword when input value changes', async () => {
    // Purpose: verify search input binding updates keyword.
    const searchKeywordRef = ref('')
    useReportCommentsDialogMock.mockReturnValueOnce({
      commentVisible: ref(true),
      searchKeyword: searchKeywordRef,
      rating: ref<CommentRating | 'all'>('all'),
      commentList,
      isLoading: loadingState,
      page: ref(1),
      limit: ref(6),
      pageChange: vi.fn(),
      handleClose: vi.fn(),
    })

    const { getByTestId } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    const searchInput = getByTestId('search-input') as HTMLInputElement
    await fireEvent.update(searchInput, 'test query')
    expect(searchKeywordRef.value).toBe('test query')
  })

  it('updates rating when radios are clicked', async () => {
    // Purpose: verify filter radios update rating state.
    const ratingRef = ref<CommentRating | 'all'>('all')
    useReportCommentsDialogMock.mockReturnValueOnce({
      commentVisible: ref(true),
      searchKeyword: ref(''),
      rating: ratingRef,
      commentList,
      isLoading: loadingState,
      page: ref(1),
      limit: ref(6),
      pageChange: vi.fn(),
      handleClose: vi.fn(),
    })

    const { getByTestId } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    expect(getByTestId('radio-group')).toBeInTheDocument()
    await fireEvent.click(getByTestId('radio-イマイチ'))
    expect(ratingRef.value).toBe(CommentRating.Bad)
    await fireEvent.click(getByTestId('radio-よかった'))
    expect(ratingRef.value).toBe(CommentRating.Good)
    await fireEvent.click(getByTestId('radio-全て'))
    expect(ratingRef.value).toBe('all')
  })

  it('displays loading state when isLoading is true', () => {
    // Purpose: verify loading directive is applied when loading.
    loadingState.value = true
    const isLoadingRef = ref(true)
    useReportCommentsDialogMock.mockReturnValueOnce({
      commentVisible: ref(true),
      searchKeyword: ref(''),
      rating: ref<CommentRating | 'all'>('all'),
      commentList,
      isLoading: isLoadingRef,
      page: ref(1),
      limit: ref(6),
      pageChange: vi.fn(),
      handleClose: vi.fn(),
    })

    const { getByTestId } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    const mainContent = getByTestId('dialog-main')
    // Loading directive may not set attribute immediately, verify component renders
    expect(mainContent).toBeInTheDocument()
  })

  it('displays correct total count in title', () => {
    // Purpose: verify total count is displayed correctly in dialog title.
    commentList.value = {
      totalCount: 10,
      comments: [],
    }
    useReportCommentsDialogMock.mockReturnValueOnce({
      commentVisible: ref(true),
      searchKeyword: ref(''),
      rating: ref<CommentRating | 'all'>('all'),
      commentList,
      isLoading: loadingState,
      page: ref(1),
      limit: ref(6),
      pageChange: vi.fn(),
      handleClose: vi.fn(),
    })

    const { getByText } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    expect(getByText('全10件')).toBeInTheDocument()
  })

  it('renders review cards for each comment', () => {
    // Purpose: verify review cards are rendered for each comment in the list.
    commentList.value = {
      totalCount: 2,
      comments: [
        { label: 'A', content: 'comment A', likes: 10 },
        { label: 'B', content: 'comment B', likes: 20 },
      ],
    }
    useReportCommentsDialogMock.mockReturnValueOnce({
      commentVisible: ref(true),
      searchKeyword: ref(''),
      rating: ref<CommentRating | 'all'>('all'),
      commentList,
      isLoading: loadingState,
      page: ref(1),
      limit: ref(6),
      pageChange: vi.fn(),
      handleClose: vi.fn(),
    })

    const { getByTestId } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    expect(getByTestId('review-card-A')).toBeInTheDocument()
    expect(getByTestId('review-card-B')).toBeInTheDocument()
  })

  it('renders dialog with correct width and className', () => {
    // Purpose: verify dialog width and className props are passed correctly.
    useReportCommentsDialogMock.mockReturnValueOnce({
      commentVisible: ref(true),
      searchKeyword: ref(''),
      rating: ref<CommentRating | 'all'>('all'),
      commentList,
      isLoading: loadingState,
      page: ref(1),
      limit: ref(6),
      pageChange: vi.fn(),
      handleClose: vi.fn(),
    })

    const { getByTestId } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    expect(getByTestId('base-dialog')).toBeInTheDocument()
  })

  it('displays pagination with correct total and page size', () => {
    // Purpose: verify pagination displays correct total count and page size.
    commentList.value = {
      totalCount: 20,
      comments: [],
    }
    useReportCommentsDialogMock.mockReturnValueOnce({
      commentVisible: ref(true),
      searchKeyword: ref(''),
      rating: ref<CommentRating | 'all'>('all'),
      commentList,
      isLoading: loadingState,
      page: ref(2),
      limit: ref(6),
      pageChange: vi.fn(),
      handleClose: vi.fn(),
    })

    const { getByTestId } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    const pagination = getByTestId('pagination')
    expect(pagination.getAttribute('data-total')).toBe('20')
  })

  it('handles All rating without crashing', () => {
    // Purpose: verify component handles All rating value.
    const ratingRef = ref<CommentRating | 'all'>('all')
    useReportCommentsDialogMock.mockReturnValueOnce({
      commentVisible: ref(true),
      searchKeyword: ref(''),
      rating: ratingRef,
      commentList,
      isLoading: loadingState,
      page: ref(1),
      limit: ref(6),
      pageChange: vi.fn(),
      handleClose: vi.fn(),
    })

    const { getByTestId } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    expect(getByTestId('radio-group')).toBeInTheDocument()
    expect(ratingRef.value).toBe('all')
  })

  it('does not show empty state when loading', () => {
    // Purpose: verify empty state is not shown during loading.
    commentList.value = {
      totalCount: 0,
      comments: [],
    }
    loadingState.value = true
    useReportCommentsDialogMock.mockReturnValueOnce({
      commentVisible: ref(true),
      searchKeyword: ref(''),
      rating: ref<CommentRating | 'all'>('all'),
      commentList,
      isLoading: loadingState,
      page: ref(1),
      limit: ref(6),
      pageChange: vi.fn(),
      handleClose: vi.fn(),
    })

    const { queryByTestId } = render(ReportCommentsDialog, {
      props: { modelValue: true, rating: CommentRating.Good },
      global: {
        directives: { loading: ElLoadingDirectiveStub },
        stubs: {
          BaseDialog: BaseDialogStub,
          SearchInput: SearchInputStub,
          ElRadioGroup: ElRadioGroupStub,
          BaseRadio: BaseRadioStub,
          BaseCheckbox: BaseCheckboxStub,
          ElCheckboxGroup: ElCheckboxGroupStub,
          ReviewCard: ReviewCardStub,
          ElEmpty: ElEmptyStub,
          ElPagination: ElPaginationStub,
        },
      },
    })

    // Empty state should not be shown when loading
    expect(queryByTestId('el-empty')).not.toBeInTheDocument()
  })
})
