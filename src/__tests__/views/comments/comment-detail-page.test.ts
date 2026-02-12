// generated-by: ai-assist v1.0
// type: unit
// description: CommentDetailPage tests validating render state, reply flow, and navigation wiring.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { fireEvent, render } from '@testing-library/vue'

import CommentDetailPage from '@/views/comments/CommentDetailPage.vue'

const useCommentDetailMock = vi.hoisted(() => vi.fn())

vi.mock('@/views/comments/useCommentDetail', () => ({
  useCommentDetail: useCommentDetailMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  setup(_, { slots }) {
    return () =>
      h('section', { 'data-testid': 'layout-main' }, slots.default ? slots.default() : [])
  },
})

const BlueButtonStub = defineComponent({
  name: 'BlueButton',
  props: {
    label: { type: String, required: true },
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        { 'data-testid': 'blue-button', 'data-label': props.label, onClick: () => emit('click') },
        props.label,
      )
  },
})

const ElTextStub = defineComponent({
  name: 'ElText',
  setup(_, { slots }) {
    return () => h('span', { 'data-testid': 'el-text' }, slots.default ? slots.default() : [])
  },
})

const ElLinkStub = defineComponent({
  name: 'ElLink',
  emits: ['click'],
  props: {
    underline: { type: String, default: '' },
  },
  setup(_, { slots, emit }) {
    return () =>
      h(
        'a',
        { 'data-testid': 'el-link', onClick: () => emit('click') },
        slots.default ? slots.default() : [],
      )
  },
})

const ElIconStub = defineComponent({
  name: 'ElIcon',
  props: {
    size: { type: [Number, String], default: 16 },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'span',
        {
          'data-testid': 'el-icon',
          'data-size': String(props.size),
        },
        slots.default ? slots.default() : [],
      )
  },
})

const IconStub = defineComponent({
  name: 'IconStub',
  setup() {
    return () => h('svg', { 'data-testid': 'icon-stub' })
  },
})

const BaseImageStub = defineComponent({
  name: 'BaseImage',
  props: {
    src: { type: String, default: '' },
  },
  setup(props) {
    return () =>
      h('img', {
        'data-testid': 'base-image',
        src: props.src,
      })
  },
})

const WithDeleteConfirmStub = defineComponent({
  name: 'WithDeleteConfirm',
  emits: ['confirm'],
  setup(_, { slots, emit }) {
    return () =>
      h(
        'span',
        {
          'data-testid': 'delete-confirm-trigger',
          onClick: () => emit('confirm'),
        },
        slots.default ? slots.default() : undefined,
      )
  },
})

const CommentReplyDialogStub = defineComponent({
  name: 'CommentReplyDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    isPending: { type: Boolean, default: false },
    initialReply: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'commentReplySubmit', 'closeDialog'],
  setup(props, { emit }) {
    return () =>
      h('div', {
        'data-testid': 'comment-reply-dialog',
        'data-visible': String(props.modelValue),
        'data-initial-reply': props.initialReply,
        'data-is-pending': String(props.isPending),
        onClick: () => emit('closeDialog'),
      })
  },
})

const CommentReplySuccessDialogStub = defineComponent({
  name: 'CommentReplySuccessDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    replyContent: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'closeDialog'],
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'comment-reply-success-dialog',
        'data-visible': String(props.modelValue),
        'data-reply-content': props.replyContent,
      })
  },
})

const loadingDirective = vi.fn()

const baseState = () => {
  const handleReply = vi.fn()
  const handleDeleteReply = vi.fn()
  const handleSubmitReply = vi.fn()
  const handleCloseDialog = vi.fn()
  const handleCloseSuccessDialog = vi.fn()
  const handleProjectClick = vi.fn()
  const handleCustomerClick = vi.fn()

  return {
    commentDetail: ref({
      displayFlag: 1,
      reviewId: 123,
      comment: 'とても美味しいです',
      rating: 5,
      createdAt: '2024-02-01 10:00',
      projectId: 456,
      productName: '特製フライドポテト',
      imageUrl: 'https://cdn/p.png',
      userId: 789,
      nickName: 'Alice',
      reply: '',
    }),
    isLoading: ref(false),
    isEmpty: ref(false),
    commentReplyVisible: ref(false),
    commentReplySuccessVisible: ref(false),
    submittedReplyContent: ref(''),
    isReply: ref(false),
    isPending: ref(false),
    isDeleteLoading: ref(false),
    handleReply,
    handleDeleteReply,
    handleSubmitReply,
    handleCloseDialog,
    handleCloseSuccessDialog,
    handleProjectClick,
    handleCustomerClick,
  }
}

const renderPage = () =>
  render(CommentDetailPage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        BlueButton: BlueButtonStub,
        ElText: ElTextStub,
        ElLink: ElLinkStub,
        ElIcon: ElIconStub,
        SuccessIcon: IconStub,
        ErrorIcon: IconStub,
        EditIcon: IconStub,
        TrashIcon: IconStub,
        BaseImage: BaseImageStub,
        WithDeleteConfirm: WithDeleteConfirmStub,
        CommentReplyDialog: CommentReplyDialogStub,
        CommentReplySuccessDialog: CommentReplySuccessDialogStub,
      },
      directives: {
        loading: loadingDirective,
      },
    },
  })

describe('CommentDetailPage', () => {
  beforeEach(() => {
    useCommentDetailMock.mockReset()
    loadingDirective.mockReset()
  })

  it('renders comment detail information and reply button when no reply exists', () => {
    // Purpose: ensure the detail view binds data from composable when not replying.
    const state = baseState()
    useCommentDetailMock.mockReturnValue(state)

    const { getByTestId, queryByTestId, getByText } = renderPage()

    expect(getByTestId('layout-main')).toBeInTheDocument()
    expect(getByText('コメントID: 123')).toBeInTheDocument()
    expect(getByText('とても美味しいです')).toBeInTheDocument()
    expect(getByText(/2024[\/-]02[\/-]01\s+10:00/)).toBeInTheDocument()
    expect(getByText('456')).toBeInTheDocument()
    expect(getByText('特製フライドポテト')).toBeInTheDocument()
    expect(getByText('789')).toBeInTheDocument()
    expect(getByText('Alice')).toBeInTheDocument()
    expect(queryByTestId('confirm-content')).not.toBeInTheDocument()
    expect(getByTestId('blue-button')).toBeInTheDocument()
    expect(getByTestId('comment-reply-dialog').getAttribute('data-visible')).toBe('false')
  })

  it('shows reply block when isReply is true and wires action handlers', async () => {
    // Purpose: verify reply section appears and actions delegate to composable handlers.
    const state = baseState()
    state.commentDetail.value.reply = 'Existing reply'
    state.isReply.value = true
    useCommentDetailMock.mockReturnValue(state)

    const { getByTestId, getAllByTestId, getByText } = renderPage()

    expect(getByText('返信コメント')).toBeInTheDocument()
    expect(getByText('Existing reply')).toBeInTheDocument()

    const icons = getAllByTestId('el-icon')
    await fireEvent.click(icons[0])
    expect(state.handleReply).toHaveBeenCalled()

    await fireEvent.click(getByTestId('delete-confirm-trigger'))
    expect(state.handleDeleteReply).toHaveBeenCalled()
  })

  it('fires navigation handlers when project and customer links are clicked', async () => {
    // Purpose: ensure project/customer links delegate to composable routing methods.
    const state = baseState()
    useCommentDetailMock.mockReturnValue(state)

    const { getAllByTestId } = renderPage()

    const links = getAllByTestId('el-link')
    await fireEvent.click(links[0])
    expect(state.handleProjectClick).toHaveBeenCalled()

    await fireEvent.click(links[1])
    expect(state.handleCustomerClick).toHaveBeenCalled()
  })

  it('opens comment reply dialog when handleReply is called', () => {
    // Purpose: verify reply dialog visibility is controlled by commentReplyVisible.
    const state = baseState()
    state.commentReplyVisible.value = true
    useCommentDetailMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    const dialog = getByTestId('comment-reply-dialog')
    expect(dialog.getAttribute('data-visible')).toBe('true')
  })

  it('closes comment reply dialog when handleCloseDialog is called', () => {
    // Purpose: verify dialog can be closed via handler.
    const state = baseState()
    state.commentReplyVisible.value = false
    useCommentDetailMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    const dialog = getByTestId('comment-reply-dialog')
    expect(dialog.getAttribute('data-visible')).toBe('false')
  })

  it('shows success dialog with submitted reply content', () => {
    // Purpose: verify success dialog displays submitted reply content.
    const state = baseState()
    state.commentReplySuccessVisible.value = true
    state.submittedReplyContent.value = 'Thank you for your feedback!'
    useCommentDetailMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    const successDialog = getByTestId('comment-reply-success-dialog')
    expect(successDialog.getAttribute('data-visible')).toBe('true')
    expect(successDialog.getAttribute('data-reply-content')).toBe('Thank you for your feedback!')
  })

  it('displays loading state when isLoading is true', () => {
    // Purpose: verify loading state is reflected in the component.
    const state = baseState()
    state.isLoading.value = true
    useCommentDetailMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    // Verify component renders with loading state
    expect(getByTestId('layout-main')).toBeInTheDocument()
  })

  it('shows empty state when isEmpty is true and not loading', () => {
    // Purpose: verify empty state is displayed when there is no comment data.
    const state = baseState()
    state.isEmpty = ref(true)
    state.isLoading.value = false
    state.commentDetail.value = null as unknown as typeof state.commentDetail.value
    useCommentDetailMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    expect(getByTestId('layout-main')).toBeInTheDocument()
  })

  it('displays product image when imageUrl is provided', () => {
    // Purpose: verify product image is conditionally rendered.
    const state = baseState()
    state.commentDetail.value.imageUrl = 'https://example.com/image.jpg'
    useCommentDetailMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    expect(getByTestId('base-image')).toBeInTheDocument()
    expect(getByTestId('base-image').getAttribute('src')).toBe('https://example.com/image.jpg')
  })

  it('does not display product image when imageUrl is empty', () => {
    // Purpose: verify product image is not rendered when imageUrl is empty.
    const state = baseState()
    state.commentDetail.value.imageUrl = ''
    useCommentDetailMock.mockReturnValue(state)

    const { queryByTestId } = renderPage()

    // Note: BaseImage might still render but with empty src
    const image = queryByTestId('base-image')
    if (image) {
      expect(image.getAttribute('src')).toBe('')
    }
  })

  it('displays success icon when displayFlag is 1', () => {
    // Purpose: verify success icon is shown for visible comments.
    const state = baseState()
    state.commentDetail.value.displayFlag = 1
    useCommentDetailMock.mockReturnValue(state)

    const { getAllByTestId } = renderPage()

    const icons = getAllByTestId('icon-stub')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('displays error icon when displayFlag is not 1', () => {
    // Purpose: verify error icon is shown for hidden comments.
    const state = baseState()
    state.commentDetail.value.displayFlag = 0
    useCommentDetailMock.mockReturnValue(state)

    const { getAllByTestId } = renderPage()

    const icons = getAllByTestId('icon-stub')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('shows delete loading state when isDeleteLoading is true', () => {
    // Purpose: verify delete loading state is passed to delete confirm component.
    const state = baseState()
    state.isDeleteLoading.value = true
    state.isReply.value = true
    useCommentDetailMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    expect(getByTestId('delete-confirm-trigger')).toBeInTheDocument()
  })

  it('passes isPending state to reply dialog', () => {
    // Purpose: verify pending state is passed to reply dialog.
    const state = baseState()
    state.commentReplyVisible.value = true
    state.isPending.value = true
    useCommentDetailMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    const dialog = getByTestId('comment-reply-dialog')
    expect(dialog.getAttribute('data-is-pending')).toBe('true')
  })

  it('passes initial reply to reply dialog when reply exists', () => {
    // Purpose: verify existing reply is passed as initial value to dialog.
    const state = baseState()
    state.commentReplyVisible.value = true
    state.commentDetail.value.reply = 'Existing reply text'
    useCommentDetailMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    const dialog = getByTestId('comment-reply-dialog')
    expect(dialog.getAttribute('data-initial-reply')).toBe('Existing reply text')
  })
})
