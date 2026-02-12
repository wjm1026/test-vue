import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import { defineComponent, h } from 'vue'

import GlobalErrorDialog from '@/components/dialog/GlobalErrorDialog.vue'

const mocks = vi.hoisted(() => {
  const pushMock = vi.fn()
  const hideErrorMock = vi.fn()
  const useErrorStoreMock = vi.fn(() => ({
    showErrorDialog: true,
    hideError: hideErrorMock,
  }))

  return {
    getPushMock: () => pushMock,
    getHideErrorMock: () => hideErrorMock,
    getUseErrorStoreMock: () => useErrorStoreMock,
  }
})

vi.mock('@/stores/error', () => ({
  useErrorStore: mocks.getUseErrorStoreMock(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mocks.getPushMock(),
  }),
}))

vi.mock('@/router/routes', () => ({
  routePaths: {
    projects: {
      root: '/projects',
    },
  },
}))

vi.mock('@/components/dialog/BaseDialog.vue', () => {
  const BaseDialogStub = defineComponent({
    props: {
      modelValue: { type: Boolean, default: false },
    },
    emits: ['update:modelValue'],
    setup(props, { slots, emit }) {
      return () =>
        h(
          'div',
          { 'data-testid': 'base-dialog', 'data-visible': props.modelValue ? 'true' : 'false' },
          [
            slots.main?.(),
            h(
              'button',
              { 'data-testid': 'dialog-close', onClick: () => emit('update:modelValue', false) },
              'Close',
            ),
          ],
        )
    },
  })
  return { default: BaseDialogStub }
})

vi.mock('@/components/button/BlueButton.vue', () => {
  const BlueButtonStub = defineComponent({
    props: {
      label: { type: String, default: '' },
      className: { type: String, default: '' },
    },
    emits: ['click'],
    setup(props, { emit }) {
      return () =>
        h(
          'button',
          {
            'data-testid': 'retry-button',
            class: props.className,
            onClick: () => emit('click'),
          },
          props.label,
        )
    },
  })
  return { default: BlueButtonStub }
})

vi.mock('@/components/button/WhiteButton.vue', () => {
  const WhiteButtonStub = defineComponent({
    props: {
      label: { type: String, default: '' },
      className: { type: String, default: '' },
    },
    emits: ['click'],
    setup(props, { emit }) {
      return () =>
        h(
          'button',
          {
            'data-testid': 'top-button',
            class: props.className,
            onClick: () => emit('click'),
          },
          props.label,
        )
    },
  })
  return { default: WhiteButtonStub }
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GlobalErrorDialog', () => {
  const getMocks = () => ({
    hideErrorMock: mocks.getHideErrorMock(),
    pushMock: mocks.getPushMock(),
  })

  it('renders dialog content', () => {
    const { getByText } = render(GlobalErrorDialog)

    expect(getByText('情報の読み込みに失敗しました')).toBeTruthy()
    expect(getByText('もう一度試す')).toBeTruthy()
    expect(getByText('トップへ戻る')).toBeTruthy()
  })

  it('retries by hiding error and reloading page', async () => {
    const { hideErrorMock } = getMocks()
    const originalLocation = window.location
    const reloadSpy = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, reload: reloadSpy },
      writable: true,
    })

    const { getByTestId } = render(GlobalErrorDialog)

    await fireEvent.click(getByTestId('retry-button'))

    expect(hideErrorMock).toHaveBeenCalledTimes(1)
    expect(reloadSpy).toHaveBeenCalledTimes(1)

    Object.defineProperty(window, 'location', { value: originalLocation, writable: true })
  })

  it('navigates to top and hides error when top button clicked', async () => {
    const { hideErrorMock, pushMock } = getMocks()
    const { getByTestId } = render(GlobalErrorDialog)

    await fireEvent.click(getByTestId('top-button'))

    expect(pushMock).toHaveBeenCalledWith('/projects')
    expect(hideErrorMock).toHaveBeenCalledTimes(1)
  })

  it('hides error when dialog requests closing', async () => {
    const { hideErrorMock } = getMocks()
    const { getByTestId } = render(GlobalErrorDialog)

    await fireEvent.click(getByTestId('dialog-close'))

    expect(hideErrorMock).toHaveBeenCalledTimes(1)
  })
})
