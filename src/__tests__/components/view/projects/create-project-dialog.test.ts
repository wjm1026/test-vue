import { fireEvent, render } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import CreateProjectDialog from '@/components/view/projects/CreateProjectDialog.vue'
import { routePaths } from '@/router/routes'
import type { RegistrationProjectData } from '@/api/types/projects'

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

const BaseDialogStub = defineComponent({
  name: 'BaseDialogStub',
  props: {
    modelValue: { type: Boolean, default: false },
    dialogTitle: { type: String, default: '' },
    className: { type: String, default: '' },
  },
  emits: ['close'],
  setup(props, { slots, emit }) {
    return () =>
      h(
        'section',
        {
          'data-testid': 'base-dialog',
          'data-open': props.modelValue ? 'true' : 'false',
          'data-class': props.className,
        },
        [
          h('p', { 'data-testid': 'dialog-title' }, props.dialogTitle),
          slots.main ? slots.main() : null,
          h(
            'button',
            {
              type: 'button',
              'data-testid': 'close-from-dialog',
              onClick: () => emit('close'),
            },
            'close',
          ),
        ],
      )
  },
})

const BlueButtonStub = defineComponent({
  name: 'BlueButtonStub',
  props: { label: { type: String, default: '' } },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          onClick: () => emit('click'),
        },
        props.label,
      )
  },
})

const ElImageStub = defineComponent({
  name: 'ElImageStub',
  props: {
    src: { type: String, default: '' },
  },
  setup(props) {
    return () =>
      h('img', {
        'data-testid': 'project-image',
        src: props.src,
      })
  },
})

const ElTextStub = defineComponent({
  name: 'ElTextStub',
  setup(_, { slots }) {
    return () => h('span', slots.default ? slots.default() : [])
  },
})

const renderDialog = (override?: Partial<RegistrationProjectData>) => {
  const project: RegistrationProjectData = {
    name: '春の試食会',
    startDate: '2025-03-01',
    endDate: '2025-04-01',
    products: [
      {
        productName: 'スナックA',
        maker: 'ACME',
        janCode: '1111111111111',
        createdAt: '2025-01-01',
        imageUrl: 'https://cdn.example.com/snack-a.png',
      },
    ],
    ...override,
  }

  const closeDialog = vi.fn()

  const utils = render(CreateProjectDialog, {
    props: {
      modelValue: true,
      project,
      onCloseDialog: closeDialog,
    },
    global: {
      stubs: {
        BaseDialog: BaseDialogStub,
        BlueButton: BlueButtonStub,
        ElImage: ElImageStub,
        ElText: ElTextStub,
      },
    },
  })

  return { ...utils, project, closeDialog }
}

describe('CreateProjectDialog.vue', () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  it('renders the project summary and dialog shell when opened', async () => {
    // Ensures the dialog mirrors the registration payload for confirmation.
    const { getByTestId, getByText, project } = renderDialog()
    await nextTick()

    expect(getByTestId('base-dialog').getAttribute('data-open')).toBe('true')
    expect(getByTestId('dialog-title').textContent).toBe('プロジェクトが作成されました')
    expect(getByTestId('project-image')).toHaveAttribute('src', project.products[0].imageUrl)
    expect(getByText(project.name)).toBeInTheDocument()
    expect(getByText(`${project.startDate} ~ ${project.endDate}`)).toBeInTheDocument()
  })

  it('emits closeDialog, hides the modal, and routes to projects root when closed', async () => {
    // Confirms both the button handler and routing contract fire on dialog dismissal.
    const { getByRole, getByTestId, closeDialog } = renderDialog()
    await nextTick()

    await fireEvent.click(getByRole('button', { name: '閉じる' }))
    await nextTick()

    expect(closeDialog).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith(routePaths.projects.root)
    expect(getByTestId('base-dialog').getAttribute('data-open')).toBe('false')
  })

  it('handles BaseDialog close events the same as button clicks', async () => {
    // BaseDialog close hooks should also propagate the navigation and emit.
    const { getByTestId, closeDialog } = renderDialog()
    await nextTick()

    await fireEvent.click(getByTestId('close-from-dialog'))
    await nextTick()

    expect(closeDialog).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith(routePaths.projects.root)
  })

  it('renders project image from first product', async () => {
    // Purpose: verify project image is displayed from first product in products array.
    const { getByTestId, project } = renderDialog()
    await nextTick()

    const image = getByTestId('project-image')
    expect(image).toHaveAttribute('src', project.products[0].imageUrl)
  })

  it('handles empty products array', async () => {
    // Purpose: verify dialog handles empty products array gracefully.
    const { getByTestId } = renderDialog({ products: [] })
    await nextTick()

    expect(getByTestId('base-dialog')).toBeInTheDocument()
  })

  it('displays project name and date range correctly', async () => {
    // Purpose: verify project information is displayed correctly.
    const { getByText, project } = renderDialog()
    await nextTick()

    expect(getByText(project.name)).toBeInTheDocument()
    expect(getByText(`${project.startDate} ~ ${project.endDate}`)).toBeInTheDocument()
  })

  it('handles project with multiple products', async () => {
    // Purpose: verify dialog handles projects with multiple products.
    const { getByTestId, project } = renderDialog({
      products: [
        {
          productName: 'Product 1',
          maker: 'Maker 1',
          janCode: '1111111111111',
          createdAt: '2025-01-01',
          imageUrl: 'https://cdn.example.com/product1.png',
        },
        {
          productName: 'Product 2',
          maker: 'Maker 2',
          janCode: '2222222222222',
          createdAt: '2025-01-02',
          imageUrl: 'https://cdn.example.com/product2.png',
        },
      ],
    })
    await nextTick()

    expect(getByTestId('base-dialog')).toBeInTheDocument()
    expect(getByTestId('project-image').getAttribute('src')).toBe(project.products[0].imageUrl)
  })

  it('displays project dates correctly', async () => {
    // Purpose: verify project date range is displayed correctly.
    const { getByText, project } = renderDialog()
    await nextTick()

    expect(getByText(`${project.startDate} ~ ${project.endDate}`)).toBeInTheDocument()
  })

  it('handles empty project name', async () => {
    // Purpose: verify dialog handles empty project name gracefully.
    const { getByTestId } = renderDialog({ name: '' })
    await nextTick()

    expect(getByTestId('base-dialog')).toBeInTheDocument()
  })
})
