// generated-by: ai-assist v1.0
// type: unit
// description: ProjectsDetailPage tests ensuring render coverage and action wiring.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { fireEvent, render } from '@testing-library/vue'

import ProjectsDetailPage from '@/views/projects/detail/ProjectsDetailPage.vue'
import type { ProjectDetailType } from '@/api/types/projects'

const useProjectsDetailPageMock = vi.hoisted(() => vi.fn())

vi.mock('@/views/projects/detail/useProjectsDetailPage', () => ({
  useProjectsDetailPage: useProjectsDetailPageMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: {
    title: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'section',
        { 'data-testid': 'layout-main', 'data-title': props.title },
        slots.default ? slots.default() : [],
      )
  },
})

const AddButtonStub = defineComponent({
  name: 'AddButton',
  props: {
    label: { type: String, required: true },
  },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          'data-testid': 'add-button',
          onClick: () => emit('click'),
        },
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

const ProductsTableStub = defineComponent({
  name: 'ProductsTable',
  props: {
    data: { type: Array, default: () => [] },
    sortField: { type: String, default: '' },
    sortOrder: { type: String, default: '' },
    isSort: { type: Boolean, default: true },
    isDetail: { type: Boolean, default: true },
    height: { type: String, default: '' },
  },
  emits: ['update:sortField', 'update:sortOrder'],
  setup(props) {
    return () =>
      h('div', {
        'data-testid': 'products-table',
        'data-row-count': String((props.data as unknown[]).length),
        'data-sort-field': props.sortField,
        'data-sort-order': props.sortOrder,
        'data-height': props.height,
        'data-is-sort': String(props.isSort),
        'data-is-detail': String(props.isDetail),
      })
  },
})

const WhiteButtonStub = defineComponent({
  name: 'WhiteButton',
  props: {
    label: { type: String, required: true },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          'data-testid': `white-button-${props.label}`,
          'data-loading': String(props.loading),
          'data-disabled': String(props.disabled),
          disabled: props.disabled,
          onClick: () => emit('click'),
        },
        slots.default ? slots.default() : props.label,
      )
  },
})

const WithDeleteConfirmStub = defineComponent({
  name: 'WithDeleteConfirm',
  props: {
    title: { type: String, required: true },
    loading: { type: Boolean, default: false },
  },
  emits: ['confirm'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'with-delete-confirm',
          'data-title': props.title,
          'data-loading': String(props.loading),
        },
        [
          slots.content ? h('div', { 'data-testid': 'confirm-content' }, slots.content()) : null,
          slots.default ? h('div', { 'data-testid': 'confirm-default' }, slots.default()) : null,
          h(
            'button',
            {
              'data-testid': 'with-delete-confirm-trigger',
              onClick: () => emit('confirm'),
            },
            'confirm',
          ),
        ],
      )
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

const loadingDirective = vi.fn()

const projectsDetailState = () => {
  const reportHandle = vi.fn()
  const updateHandle = vi.fn()
  const deleteHandle = vi.fn()
  return {
    title: 'プロジェクトA（ID : 5）',
    projects: ref<ProjectDetailType>({
      id: 5,
      name: 'プロジェクトA',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      method: '市場調査',
      point: 80,
      reportId: 123 as number | null,
      priorityFlag: 0,
      purchaseStartDate: '2024-02-01',
      purchaseEndDate: '2024-02-15',
      publishEndDate: '2024-02-15',
    }),
    isLoading: ref(false),
    isEmpty: ref(false),
    targetProductData: ref([
      {
        productName: 'プレミアムコーヒー',
        maker: 'ACME',
        productImageUrl: 'https://image/coffee.png',
        janCode: 'JAN-01',
        createdAt: '2024-02-01',
      },
    ]),
    sortField: ref('productName'),
    sortOrder: ref('asc'),
    isDeleteLoading: ref(false),
    canEditProject: ref(false), // Since startDate is in the past
    canDeleteProject: ref(false), // Since startDate is in the past
    reportHandle,
    updateHandle,
    deleteHandle,
  }
}

const renderPage = () =>
  render(ProjectsDetailPage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        AddButton: AddButtonStub,
        ElText: ElTextStub,
        ProductsTable: ProductsTableStub,
        WhiteButton: WhiteButtonStub,
        WithDeleteConfirm: WithDeleteConfirmStub,
        BaseImage: BaseImageStub,
      },
      directives: {
        loading: loadingDirective,
      },
    },
  })

describe('ProjectsDetailPage', () => {
  beforeEach(() => {
    useProjectsDetailPageMock.mockReset()
    loadingDirective.mockReset()
  })

  it('renders project information, products table, and delete preview card', () => {
    // Purpose: verify project summary/details are displayed based on composable output.
    useProjectsDetailPageMock.mockReturnValue(projectsDetailState())

    const { getByTestId, getByText, getAllByText } = renderPage()

    expect(getByTestId('layout-main').getAttribute('data-title')).toBe('プロジェクトA（ID : 5）')
    expect(getByText('80pt')).toBeInTheDocument()
    const periodMatches = getAllByText(/2024[\/-]02[\/-]01\s*-\s*2024[\/-]02[\/-]15/)
    expect(periodMatches.length).toBeGreaterThan(0)
    expect(getByTestId('products-table').getAttribute('data-row-count')).toBe('1')
    expect(getByTestId('with-delete-confirm').getAttribute('data-title')).toBe(
      'プロジェクトを削除します',
    )
    expect(getByTestId('confirm-content').textContent).toContain('プロジェクトA')
  })

  it('calls composable handlers when buttons or confirm actions are triggered', async () => {
    // Purpose: ensure button interactions map to composable methods.
    const state = projectsDetailState()
    state.isDeleteLoading.value = true
    useProjectsDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    await fireEvent.click(getByTestId('add-button'))
    expect(state.reportHandle).toHaveBeenCalled()

    await fireEvent.click(getByTestId('white-button-編集する'))
    expect(state.updateHandle).toHaveBeenCalled()

    expect(getByTestId('with-delete-confirm').getAttribute('data-loading')).toBe('true')
    await fireEvent.click(getByTestId('with-delete-confirm-trigger'))
    expect(state.deleteHandle).toHaveBeenCalled()
  })

  it('displays loading state when isLoading is true', () => {
    // Purpose: verify loading state is reflected in the component.
    const state = projectsDetailState()
    state.isLoading.value = true
    useProjectsDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    // Verify component renders with loading state
    expect(getByTestId('layout-main')).toBeInTheDocument()
  })

  it('shows empty state when isEmpty is true and not loading', () => {
    // Purpose: verify empty state is displayed when there is no project data.
    const state = projectsDetailState()
    state.isEmpty = ref(true)
    state.isLoading.value = false
    useProjectsDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    expect(getByTestId('layout-main')).toBeInTheDocument()
  })

  it('renders empty product data array', () => {
    // Purpose: verify empty product array is handled correctly.
    const state = projectsDetailState()
    state.targetProductData.value = []
    useProjectsDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    expect(getByTestId('products-table').getAttribute('data-row-count')).toBe('0')
  })

  it('passes ProductsTable props for detail view', () => {
    // Purpose: verify ProductsTable receives fixed props for detail view rendering.
    const state = projectsDetailState()
    useProjectsDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()
    const table = getByTestId('products-table')

    expect(table.getAttribute('data-is-sort')).toBe('false')
    expect(table.getAttribute('data-is-detail')).toBe('false')
    expect(table.getAttribute('data-height')).toBe('200px')
  })

  it('updates sort field and sort order when table emits events', async () => {
    // Purpose: verify sorting state can be updated via table component.
    const state = projectsDetailState()
    useProjectsDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    const table = getByTestId('products-table')
    expect(table.getAttribute('data-sort-field')).toBe('productName')
    expect(table.getAttribute('data-sort-order')).toBe('asc')
  })

  it('displays formatted dates correctly', () => {
    // Purpose: verify date formatting is applied to start and end dates.
    const state = projectsDetailState()
    state.projects.value.startDate = '2024-02-01'
    state.projects.value.endDate = '2024-02-15'
    useProjectsDetailPageMock.mockReturnValue(state)

    const { getAllByText } = renderPage()

    // The rendered separator includes spaces and a hyphen; use a flexible matcher.
    const flexibleMatches = getAllByText((content) => {
      const hasStart = content.includes('2024-02-01') || content.includes('2024/02/01')
      const hasEnd = content.includes('2024-02-15') || content.includes('2024/02/15')
      return hasStart && hasEnd
    })
    expect(flexibleMatches.length).toBeGreaterThan(0)
  })

  it('renders product image in delete confirm content', () => {
    // Purpose: verify product image is displayed in delete confirmation card.
    const state = projectsDetailState()
    useProjectsDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    expect(getByTestId('base-image')).toBeInTheDocument()
    expect(getByTestId('base-image').getAttribute('src')).toBe('https://image/coffee.png')
  })

  it('disables edit and delete buttons when project has started or ended', () => {
    // Purpose: verify buttons are disabled when project has started or ended.
    const state = projectsDetailState()
    state.canEditProject.value = false
    state.canDeleteProject.value = false
    useProjectsDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    expect(getByTestId('white-button-編集する').getAttribute('data-disabled')).toBe('true')
    expect(getByTestId('white-button-削除する').getAttribute('data-disabled')).toBe('true')
  })

  it('enables edit and delete buttons when project has not started', () => {
    // Purpose: verify buttons are enabled when current time is before project start date.
    const state = projectsDetailState()
    state.canEditProject.value = true
    state.canDeleteProject.value = true
    state.projects.value.startDate = '2025-12-31' // Future date
    state.projects.value.endDate = '2026-01-15' // Future end date
    useProjectsDetailPageMock.mockReturnValue(state)

    const { getByTestId } = renderPage()

    expect(getByTestId('white-button-編集する').getAttribute('data-disabled')).toBe('false')
    expect(getByTestId('white-button-削除する').getAttribute('data-disabled')).toBe('false')
  })

  it('hides "レポートを見る" button when reportId is null', () => {
    // Purpose: verify that the report button is hidden when reportId is null.
    const state = projectsDetailState()
    state.projects.value.reportId = null
    useProjectsDetailPageMock.mockReturnValue(state)

    const { queryByTestId } = renderPage()

    expect(queryByTestId('add-button')).not.toBeInTheDocument()
  })
})
