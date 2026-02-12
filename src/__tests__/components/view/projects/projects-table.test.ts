import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, provide, ref } from 'vue'

import ProjectsTable from '@/components/view/projects/ProjectsTable.vue'
import { SortOrder } from '@/enum'
import { routeNames } from '@/router/routes'

const pushMock = vi.fn()

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({
      push: pushMock,
    }),
  }
})

const projectsData = [
  {
    productImageUrl: 'https://example.com/image-1.png',
    projectId: 'PRJ-001',
    projectName: 'Survey One',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    productName: 'Coffee Beans',
    janCode: '1111111111111',
    method: 'NCライト',
  },
  {
    productImageUrl: 'https://example.com/image-2.png',
    projectId: 'PRJ-002',
    projectName: 'Survey Two',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    productName: 'Tea Leaves',
    janCode: '2222222222222',
    method: 'NCインサイト',
  },
]

const TABLE_DATA_KEY = Symbol('table-data')

const ElTableStub = defineComponent({
  name: 'ElTableStub',
  inheritAttrs: false,
  props: {
    data: { type: Array as () => Array<Record<string, unknown>>, default: () => [] },
    emptyText: { type: String, default: '' },
  },
  setup(props, { slots }) {
    provide(TABLE_DATA_KEY, props)
    return () =>
      h(
        'div',
        {
          'data-testid': 'projects-table',
          'data-row-count': props.data.length,
        },
        [
          slots.default ? slots.default() : null,
          props.data.length === 0
            ? h('div', { 'data-testid': 'empty-message' }, props.emptyText)
            : null,
        ],
      )
  },
})

const ElTableColumnStub = defineComponent({
  name: 'ElTableColumnStub',
  inheritAttrs: false,
  props: {
    prop: { type: String, default: '' },
  },
  setup(props, { slots }) {
    const provided = inject(TABLE_DATA_KEY, { data: [] as Array<Record<string, unknown>> })
    const rows = provided.data ?? []
    return () => {
      const nodes = []
      if (slots.header) {
        nodes.push(h('div', { 'data-type': 'header', 'data-prop': props.prop }, slots.header()))
      }
      if (slots.default) {
        rows.forEach((row, index) => {
          nodes.push(
            h(
              'div',
              {
                'data-type': 'cell',
                'data-prop': props.prop,
                'data-row-index': index,
              },
              slots.default!({ row, $index: index }),
            ),
          )
        })
      }
      return h('div', { 'data-column': props.prop }, nodes)
    }
  },
})

const ElImageStub = defineComponent({
  name: 'ElImageStub',
  props: { src: { type: String, default: '' } },
  setup(props, { attrs }) {
    return () => h('img', { src: props.src, alt: 'project-image', ...attrs })
  },
})

const ElTextStub = defineComponent({
  name: 'ElTextStub',
  setup(_, { slots, attrs }) {
    const { onClick, ...rest } = attrs as Record<string, unknown>
    return () =>
      h(
        'button',
        {
          type: 'button',
          ...rest,
          onClick: onClick as ((event: Event) => void) | undefined,
        },
        slots.default ? slots.default() : [],
      )
  },
})

const SortHeaderStub = defineComponent({
  name: 'SortHeaderStub',
  props: {
    label: { type: String, required: true },
    field: { type: String, required: true },
    sortField: { type: String, default: '' },
    sortOrder: { type: String as () => SortOrder, default: SortOrder.Asc },
  },
  emits: ['update:sortField', 'update:sortOrder'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': `sort-${props.field}`,
          onClick: () => {
            if (props.sortField !== props.field) {
              emit('update:sortField', props.field)
              emit('update:sortOrder', SortOrder.Asc)
              return
            }
            emit(
              'update:sortOrder',
              props.sortOrder === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
            )
          },
        },
        props.label,
      )
  },
})

const globalStubs = {
  ElTable: ElTableStub,
  ElTableColumn: ElTableColumnStub,
  ElImage: ElImageStub,
  ElText: ElTextStub,
  SortHeader: SortHeaderStub,
}

describe('ProjectsTable', () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders fallback when data is empty', () => {
    const { getByTestId } = render(ProjectsTable, {
      props: {
        data: [],
        isLoading: false,
        sortField: '',
        sortOrder: SortOrder.Asc,
      },
      global: { stubs: globalStubs },
    })

    const emptyMessage = getByTestId('empty-message')
    expect(emptyMessage.textContent).toBe('プロジェクトがありません')
  })

  it('renders rows and triggers project detail navigation', async () => {
    const { getAllByText } = render(ProjectsTable, {
      props: {
        data: projectsData,
        isLoading: false,
        sortField: '',
        sortOrder: SortOrder.Asc,
      },
      global: { stubs: globalStubs },
    })

    const projectLinks = getAllByText(/PRJ-00/)
    expect(projectLinks).toHaveLength(2)

    await fireEvent.click(projectLinks[0])
    expect(pushMock).toHaveBeenCalledWith({
      name: routeNames.projects.detail,
      params: { id: 'PRJ-001' },
    })
  })

  it('navigates to product detail when clicking product name', async () => {
    const { getAllByText } = render(ProjectsTable, {
      props: {
        data: projectsData,
        isLoading: false,
        sortField: '',
        sortOrder: SortOrder.Asc,
      },
      global: { stubs: globalStubs },
    })

    const productLinks = getAllByText(/Coffee Beans|Tea Leaves/)
    expect(productLinks).toHaveLength(2)

    await fireEvent.click(productLinks[1])
    expect(pushMock).toHaveBeenLastCalledWith({
      name: routeNames.products.detail,
      params: { id: '2222222222222' },
    })
  })

  it('updates sort field and order when clicking header', async () => {
    const sortFieldModel = ref('')
    const sortOrderModel = ref<SortOrder>(SortOrder.Asc)

    const Host = defineComponent({
      setup() {
        return () =>
          h(ProjectsTable, {
            data: projectsData,
            isLoading: false,
            sortField: sortFieldModel.value,
            sortOrder: sortOrderModel.value,
            'onUpdate:sortField': ((value: string) => {
              sortFieldModel.value = value
            }) as (value: string | undefined) => void,
            'onUpdate:sortOrder': ((value: SortOrder) => {
              sortOrderModel.value = value
            }) as (value: SortOrder | undefined) => void,
          })
      },
    })

    const { getByTestId } = render(Host, {
      global: { stubs: globalStubs },
    })

    const header = getByTestId('sort-projectId')
    await fireEvent.click(header)
    expect(sortFieldModel.value).toBe('projectId')
    expect(sortOrderModel.value).toBe(SortOrder.Asc)

    await fireEvent.click(header)
    expect(sortOrderModel.value).toBe(SortOrder.Desc)
  })

  it('resets sort order to Asc when changing to a different sort field', async () => {
    const sortFieldModel = ref('projectId')
    const sortOrderModel = ref<SortOrder>(SortOrder.Desc)

    const Host = defineComponent({
      setup() {
        return () =>
          h(ProjectsTable, {
            data: projectsData,
            isLoading: false,
            sortField: sortFieldModel.value,
            sortOrder: sortOrderModel.value,
            'onUpdate:sortField': ((value: string) => {
              sortFieldModel.value = value
            }) as (value: string | undefined) => void,
            'onUpdate:sortOrder': ((value: SortOrder) => {
              sortOrderModel.value = value
            }) as (value: SortOrder | undefined) => void,
          })
      },
    })

    const { getByTestId } = render(Host, { global: { stubs: globalStubs } })

    // Currently sorting by projectId desc; click a different header -> projectName
    const otherHeader = getByTestId('sort-projectName')
    await fireEvent.click(otherHeader)
    expect(sortFieldModel.value).toBe('projectName')
    expect(sortOrderModel.value).toBe(SortOrder.Asc)
  })

  it('renders formatted date range for start and end', () => {
    const { getAllByText } = render(ProjectsTable, {
      props: {
        data: [projectsData[0]],
        isLoading: false,
        sortField: '',
        sortOrder: SortOrder.Asc,
      },
      global: { stubs: globalStubs },
    })

    // Default format is YYYY-MM-DD or YYYY/MM/DD
    const rows = getAllByText(/2024[\/-]01[\/-]01\s*-\s*2024[\/-]01[\/-]31/)
    expect(rows.length).toBeGreaterThan(0)
  })
})
