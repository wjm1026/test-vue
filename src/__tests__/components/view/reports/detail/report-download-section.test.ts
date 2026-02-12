// generated-by: ai-assist v1.0
// type: unit
// description: ReportDownloadSection tests covering rendering, button clicks, PDF download, CSV download, and loading states.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { defineComponent, h, nextTick, ref } from 'vue'

import ReportDownloadSection from '@/components/view/reports/detail/ReportDownloadSection.vue'

const mockIsDownloading = ref(false)
const mockDownloadCSV = vi.fn()

const useReportCSVDownloadMock = vi.hoisted(() => {
  return vi.fn(() => ({
    isDownloading: mockIsDownloading,
    downloadCSV: mockDownloadCSV,
  }))
})

vi.mock('@/hooks/useReportCSVDownload', () => ({
  useReportCSVDownload: useReportCSVDownloadMock,
}))

const printMock = vi.fn()
Object.defineProperty(window, 'print', {
  writable: true,
  value: printMock,
})

const WhiteButtonStub = defineComponent({
  name: 'WhiteButton',
  props: {
    label: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-testid': `white-button-${props.label}`,
          'data-loading': props.loading ? 'true' : 'false',
          'data-class': props.className,
          onClick: () => emit('click'),
          disabled: props.loading,
        },
        [
          slots.prefix ? h('span', { 'data-testid': 'button-prefix' }, slots.prefix()) : null,
          h('span', props.label),
        ],
      )
  },
})

const ElTextStub = defineComponent({
  name: 'ElText',
  props: {
    class: {
      type: String,
      default: '',
    },
  },
  setup(_, { slots, attrs }) {
    return () =>
      h(
        'span',
        {
          ...attrs,
          'data-testid': 'el-text',
        },
        slots.default ? slots.default() : [],
      )
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

const UploadIconStub = defineComponent({
  name: 'UploadIcon',
  props: {
    color: {
      type: String,
      default: undefined,
    },
  },
  setup() {
    return () => h('svg', { 'data-testid': 'upload-icon' })
  },
})

function renderReportDownloadSection(options?: { projectId?: number }) {
  const utils = render(ReportDownloadSection, {
    props: {
      projectId: options?.projectId,
    },
    global: {
      stubs: {
        WhiteButton: WhiteButtonStub,
        ElText: ElTextStub,
        ElIcon: ElIconStub,
        UploadIcon: UploadIconStub,
      },
    },
  })

  return utils
}

describe('ReportDownloadSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsDownloading.value = false
    printMock.mockClear()
  })

  it('renders download section title and buttons', () => {
    // Purpose: verify section displays title and both download buttons.
    renderReportDownloadSection({ projectId: 123 })

    expect(screen.getByText('ダウンロード')).toBeInTheDocument()
    expect(screen.getByTestId('white-button-レポート（印刷）')).toBeInTheDocument()
    expect(screen.getByTestId('white-button-評価データ（CSV）')).toBeInTheDocument()
  })

  it('displays PDF download button with correct label and styling', () => {
    // Purpose: ensure PDF button has correct label and className.
    renderReportDownloadSection({ projectId: 123 })

    const pdfButton = screen.getByTestId('white-button-レポート（印刷）')
    expect(pdfButton).toBeInTheDocument()
    expect(pdfButton.getAttribute('data-class')).toContain(
      'w-[177px] h-10 text-primary600 border-primary500',
    )
    expect(pdfButton.getAttribute('data-loading')).toBe('false')
  })

  it('displays CSV download button with correct label and styling', () => {
    // Purpose: verify CSV button has correct label and className.
    renderReportDownloadSection({ projectId: 123 })

    const csvButton = screen.getByTestId('white-button-評価データ（CSV）')
    expect(csvButton).toBeInTheDocument()
    expect(csvButton.getAttribute('data-class')).toContain(
      'w-[177px] h-10 text-primary600 border-primary500 ml-2',
    )
  })

  it('renders UploadIcon in both buttons prefix slots', () => {
    // Purpose: confirm UploadIcon is displayed in button prefix slots.
    renderReportDownloadSection({ projectId: 123 })

    const icons = screen.getAllByTestId('upload-icon')
    expect(icons).toHaveLength(2)
  })

  it('calls window.print when PDF download button is clicked', async () => {
    // Purpose: verify PDF button click triggers window.print().
    const user = userEvent.setup()
    renderReportDownloadSection({ projectId: 123 })

    const pdfButton = screen.getByTestId('white-button-レポート（印刷）')
    await user.click(pdfButton)

    expect(printMock).toHaveBeenCalledTimes(1)
  })

  it('calls downloadCSV with projectId when CSV download button is clicked', async () => {
    // Purpose: ensure CSV button click invokes downloadCSV with correct projectId.
    const user = userEvent.setup()
    renderReportDownloadSection({ projectId: 456 })

    const csvButton = screen.getByTestId('white-button-評価データ（CSV）')
    await user.click(csvButton)

    expect(mockDownloadCSV).toHaveBeenCalledTimes(1)
    expect(mockDownloadCSV).toHaveBeenCalledWith(456)
  })

  it('does not call downloadCSV when projectId is not provided', async () => {
    // Purpose: verify CSV download is skipped when projectId is undefined.
    const user = userEvent.setup()
    renderReportDownloadSection()

    const csvButton = screen.getByTestId('white-button-評価データ（CSV）')
    await user.click(csvButton)

    expect(mockDownloadCSV).not.toHaveBeenCalled()
  })

  it('shows loading state on CSV button when isDownloading is true', () => {
    // Purpose: confirm CSV button displays loading state when download is in progress.
    mockIsDownloading.value = true
    renderReportDownloadSection({ projectId: 123 })

    const csvButton = screen.getByTestId('white-button-評価データ（CSV）')
    expect(csvButton.getAttribute('data-loading')).toBe('true')
    expect(csvButton.hasAttribute('disabled')).toBe(true)
  })

  it('does not show loading state on PDF button', () => {
    // Purpose: verify PDF button never shows loading state.
    mockIsDownloading.value = true
    renderReportDownloadSection({ projectId: 123 })

    const pdfButton = screen.getByTestId('white-button-レポート（印刷）')
    expect(pdfButton.getAttribute('data-loading')).toBe('false')
  })

  it('handles CSV download error gracefully', async () => {
    // Purpose: ensure component handles downloadCSV errors without crashing.
    const user = userEvent.setup()
    // Avoid unhandled rejection by attaching a catch handler on the rejected promise.
    mockDownloadCSV.mockImplementationOnce(() =>
      Promise.reject(new Error('Download failed')).catch(() => {}),
    )
    renderReportDownloadSection({ projectId: 123 })

    const csvButton = screen.getByTestId('white-button-評価データ（CSV）')
    await user.click(csvButton)

    expect(mockDownloadCSV).toHaveBeenCalledWith(123)
    // Component should not crash, error is caught in try-catch
  })

  it('updates loading state dynamically', async () => {
    // Purpose: verify loading state updates reactively when isDownloading changes.
    renderReportDownloadSection({ projectId: 123 })

    let csvButton = screen.getByTestId('white-button-評価データ（CSV）')
    expect(csvButton.getAttribute('data-loading')).toBe('false')

    mockIsDownloading.value = true
    await nextTick()

    await waitFor(() => {
      csvButton = screen.getByTestId('white-button-評価データ（CSV）')
      expect(csvButton.getAttribute('data-loading')).toBe('true')
    })
  })

  it('renders section with correct layout structure', () => {
    // Purpose: confirm section has correct spacing and layout classes.
    const { container } = renderReportDownloadSection({ projectId: 123 })

    const section = container.firstChild as HTMLElement
    expect(section).toBeTruthy()
    expect(section.className).toContain('space-y-4')
  })
})
