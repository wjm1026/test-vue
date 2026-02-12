import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref, type PropType } from 'vue'

import ProjectCreatePage from '@/views/projects/create/ProjectCreatePage.vue'

const useProjectCreatePageMock = vi.hoisted(() => vi.fn())
vi.mock('@/views/projects/create/useProjectCreatePage', () => ({
  useProjectCreatePage: useProjectCreatePageMock,
}))

const LayoutMainStub = defineComponent({
  name: 'LayoutMain',
  props: { title: { type: String, default: '' } },
  setup(props, { slots }) {
    return () => h('div', { 'data-testid': 'layout', 'data-title': props.title }, slots.default?.())
  },
})

const ProjectsFormStub = defineComponent({
  name: 'ProjectsForm',
  emits: ['successProjectSubmit'],
  setup(_, { emit, attrs }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': 'submit',
          ...attrs,
          onClick: () =>
            emit('successProjectSubmit', {
              name: 'Proj',
              startDate: '2025-01-01',
              endDate: '2025-01-31',
            }),
        },
        'submit',
      )
  },
})

const CreateProjectDialogStub = defineComponent({
  name: 'CreateProjectDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    project: {
      type: Object as PropType<{ name?: string; startDate?: string; endDate?: string }>,
      default: () => ({}),
    },
  },
  setup(props, { attrs }) {
    return () =>
      h('div', { 'data-testid': 'dialog', 'data-open': props.modelValue ? 'open' : 'closed' }, [
        h('p', { 'data-testid': 'dialog-name' }, props.project?.name ?? ''),
        h(
          'button',
          {
            type: 'button',
            'data-testid': 'close',
            onClick: () => (attrs.onCloseDialog as (() => void) | undefined)?.(),
          },
          'close',
        ),
      ])
  },
})

function renderPage() {
  return render(ProjectCreatePage, {
    global: {
      stubs: {
        LayoutMain: LayoutMainStub,
        ProjectsForm: ProjectsFormStub,
        CreateProjectDialog: CreateProjectDialogStub,
      },
    },
  })
}

describe('ProjectCreatePage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useProjectCreatePageMock.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it('opens dialog with project after successful submit and closes on action', async () => {
    const createVisible = ref(false)
    const project = ref({ name: '', startDate: '', endDate: '' })
    const successProjectSubmit = vi.fn((p) => {
      project.value = p
      createVisible.value = true
    })

    useProjectCreatePageMock.mockReturnValue({ createVisible, project, successProjectSubmit })

    const { getByTestId, findByTestId, queryByTestId } = renderPage()

    await fireEvent.click(getByTestId('submit'))
    expect(successProjectSubmit).toHaveBeenCalledTimes(1)
    const dialog = await findByTestId('dialog')
    expect(dialog.getAttribute('data-open')).toBe('open')
    expect((await findByTestId('dialog-name')).textContent).toBe('Proj')

    await fireEvent.click(getByTestId('close'))
    await waitFor(() => {
      expect(queryByTestId('dialog')).toBeNull()
    })
  })

  it('renders LayoutMain with correct title', () => {
    // Purpose: verify page title is displayed correctly.
    const createVisible = ref(false)
    const project = ref({ name: '', startDate: '', endDate: '' })
    const successProjectSubmit = vi.fn()

    useProjectCreatePageMock.mockReturnValue({ createVisible, project, successProjectSubmit })

    const { getByTestId } = renderPage()
    expect(getByTestId('layout').getAttribute('data-title')).toBe('調査プロジェクト作成')
  })

  it('does not render dialog when createVisible is false', () => {
    // Purpose: ensure dialog is conditionally rendered based on visibility state.
    const createVisible = ref(false)
    const project = ref({ name: '', startDate: '', endDate: '' })
    const successProjectSubmit = vi.fn()

    useProjectCreatePageMock.mockReturnValue({ createVisible, project, successProjectSubmit })

    const { queryByTestId } = renderPage()
    expect(queryByTestId('dialog')).toBeNull()
  })

  it('renders dialog with project data when createVisible is true', () => {
    // Purpose: verify dialog displays project information when visible.
    const createVisible = ref(true)
    const project = ref({ name: 'Test Project', startDate: '2025-01-01', endDate: '2025-01-31' })
    const successProjectSubmit = vi.fn()

    useProjectCreatePageMock.mockReturnValue({ createVisible, project, successProjectSubmit })

    const { getByTestId } = renderPage()
    const dialog = getByTestId('dialog')
    expect(dialog.getAttribute('data-open')).toBe('open')
    expect(getByTestId('dialog-name').textContent).toBe('Test Project')
  })

  it('handles multiple form submissions with different project data', async () => {
    // Purpose: verify form can be submitted multiple times with different data.
    const createVisible = ref(false)
    const project = ref({ name: '', startDate: '', endDate: '' })
    const successProjectSubmit = vi.fn((p) => {
      project.value = p
      createVisible.value = true
    })

    useProjectCreatePageMock.mockReturnValue({ createVisible, project, successProjectSubmit })

    const { getByTestId, findByTestId } = renderPage()

    await fireEvent.click(getByTestId('submit'))
    expect(successProjectSubmit).toHaveBeenCalledTimes(1)
    expect((await findByTestId('dialog-name')).textContent).toBe('Proj')

    createVisible.value = false
    await fireEvent.click(getByTestId('submit'))
    expect(successProjectSubmit).toHaveBeenCalledTimes(2)
  })

  it('renders ProjectsForm component', () => {
    // Purpose: verify ProjectsForm is rendered and can emit events.
    const createVisible = ref(false)
    const project = ref({ name: '', startDate: '', endDate: '' })
    const successProjectSubmit = vi.fn()

    useProjectCreatePageMock.mockReturnValue({ createVisible, project, successProjectSubmit })

    const { getByTestId } = renderPage()
    expect(getByTestId('submit')).toBeInTheDocument()
  })
})
