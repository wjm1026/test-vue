import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import ProjectsPage from '@/views/projects/ProjectsPage.vue'

const useProjectsPageMock = vi.hoisted(() => vi.fn())
vi.mock('@/views/projects/useProjectsPage', () => ({
  useProjectsPage: useProjectsPageMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: {
    title: { type: String, default: '' },
    total: { type: Number, default: 0 },
    showPagination: { type: Boolean, default: true },
    page: { type: Number, default: 1 },
  },
  emits: ['page-change'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'section',
        { 'data-testid': 'layout', 'data-title': props.title, 'data-total': String(props.total) },
        [
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'next-page',
              onClick: () => emit('page-change', (props.page as number) + 1),
            },
            'next',
          ),
          slots.default ? slots.default() : null,
        ],
      )
  },
})

const AddButtonStub = defineComponent({
  name: 'AddButton',
  emits: ['click'],
  setup(_, { emit, attrs }) {
    return () =>
      h(
        'button',
        { type: 'button', 'data-testid': 'add', ...attrs, onClick: () => emit('click') },
        'add',
      )
  },
})

const SearchInputStub = defineComponent({
  name: 'SearchInput',
  props: { modelValue: { type: String, default: '' }, placeholder: { type: String, default: '' } },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () =>
      h('input', {
        'data-testid': 'search',
        value: props.modelValue,
        placeholder: (attrs.placeholder as string) ?? props.placeholder,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
      })
  },
})

const ElTextStub = defineComponent({
  name: 'ElText',
  setup(_, { slots, attrs }) {
    return () => h('p', { 'data-testid': 'count', ...attrs }, slots.default ? slots.default() : [])
  },
})

const ProjectsTableStub = defineComponent({
  name: 'ProjectsTable',
  props: {
    data: { type: Array as () => Array<Record<string, unknown>>, default: () => [] },
    isLoading: { type: Boolean, default: false },
    sortField: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
  },
  emits: ['update:sortField', 'update:sortOrder'],
  setup(props, { emit }) {
    return () =>
      h('div', { 'data-testid': 'table', 'data-loading': String(props.isLoading) }, [
        h('span', (props.data?.[0]?.projectName as string) ?? ''),
        h(
          'button',
          {
            type: 'button',
            'data-testid': 'sort',
            onClick: () => emit('update:sortField', 'name'),
          },
          'sort',
        ),
      ])
  },
})

function renderPage() {
  return render(ProjectsPage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        AddButton: AddButtonStub,
        SearchInput: SearchInputStub,
        ElText: ElTextStub,
        ProjectsTable: ProjectsTableStub,
      },
    },
  })
}

describe('ProjectsPage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useProjectsPageMock.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders count, table, and supports paging and sort binding', async () => {
    const page = ref(1)
    const searchKeyword = ref('')
    const sortField = ref('')
    const sortOrder = ref(0)
    const isLoading = ref(false)
    const projectList = ref({ total: 2, projects: [{ projectName: 'Alpha' }] })
    const pageChange = vi.fn((val: number) => (page.value = val))
    const projectAdd = vi.fn()

    useProjectsPageMock.mockReturnValue({
      projectList,
      page,
      searchKeyword,
      isLoading,
      pageChange,
      projectAdd,
      sortField,
      sortOrder,
    })

    const { getByTestId } = renderPage()
    expect(getByTestId('count').textContent).toContain('全2プロジェクト')
    expect(getByTestId('table').getAttribute('data-loading')).toBe('false')

    // Paging via LayoutMain emit
    await fireEvent.click(getByTestId('next-page'))
    expect(pageChange).toHaveBeenCalledWith(2)
    expect(page.value).toBe(2)

    // Project add button
    await fireEvent.click(getByTestId('add'))
    expect(projectAdd).toHaveBeenCalledTimes(1)

    // Sort binding via table
    await fireEvent.click(getByTestId('sort'))
    expect(sortField.value).toBe('name')
  })

  it('updates search keyword when input value changes', async () => {
    // Purpose: verify search input binding updates keyword.
    const page = ref(1)
    const searchKeyword = ref('')
    const sortField = ref('')
    const sortOrder = ref(0)
    const isLoading = ref(false)
    const projectList = ref({ total: 0, projects: [] })
    const pageChange = vi.fn()
    const projectAdd = vi.fn()

    useProjectsPageMock.mockReturnValue({
      projectList,
      page,
      searchKeyword,
      isLoading,
      pageChange,
      projectAdd,
      sortField,
      sortOrder,
    })

    const { getByTestId } = renderPage()
    const searchInput = getByTestId('search') as HTMLInputElement

    await fireEvent.update(searchInput, 'test query')
    expect(searchKeyword.value).toBe('test query')
  })

  it('displays loading state when isLoading is true', () => {
    // Purpose: verify loading state is reflected in table.
    const page = ref(1)
    const searchKeyword = ref('')
    const sortField = ref('')
    const sortOrder = ref(0)
    const isLoading = ref(true)
    const projectList = ref({ total: 0, projects: [] })
    const pageChange = vi.fn()
    const projectAdd = vi.fn()

    useProjectsPageMock.mockReturnValue({
      projectList,
      page,
      searchKeyword,
      isLoading,
      pageChange,
      projectAdd,
      sortField,
      sortOrder,
    })

    const { getByTestId } = renderPage()
    expect(getByTestId('table').getAttribute('data-loading')).toBe('true')
  })

  it('displays empty state when project list is empty', () => {
    // Purpose: verify empty state is handled correctly.
    const page = ref(1)
    const searchKeyword = ref('')
    const sortField = ref('')
    const sortOrder = ref(0)
    const isLoading = ref(false)
    const projectList = ref({ total: 0, projects: [] })
    const pageChange = vi.fn()
    const projectAdd = vi.fn()

    useProjectsPageMock.mockReturnValue({
      projectList,
      page,
      searchKeyword,
      isLoading,
      pageChange,
      projectAdd,
      sortField,
      sortOrder,
    })

    const { getByTestId } = renderPage()
    expect(getByTestId('count').textContent).toContain('全0プロジェクト')
  })
})
