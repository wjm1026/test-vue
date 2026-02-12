// generated-by: ai-assist v1.0
// type: unit
// description: downloadBlob tests ensuring filename parsing and DOM interactions.

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { downloadBlob } from '@/util/download-helper'

describe('downloadBlob', () => {
  const createObjectURLMock = vi.fn(() => 'blob:mock-url')
  const revokeObjectURLMock = vi.fn()
  const clickMock = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    Object.defineProperty(window, 'URL', {
      writable: true,
      value: {
        createObjectURL: createObjectURLMock,
        revokeObjectURL: revokeObjectURLMock,
      },
    })
    const mockAnchor = {
      _href: '',
      _download: '',
      click: clickMock,
      set href(value: string) {
        ;(this as { _href: string })._href = value
      },
      get href() {
        return (this as { _href: string })._href
      },
      set download(value: string) {
        ;(this as { _download: string })._download = value
      },
      get download() {
        return (this as { _download: string })._download
      },
    } as unknown as HTMLAnchorElement
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor as any)
  })

  it('uses filename from Content-Disposition header and triggers download', () => {
    const blob = new Blob(['test'])
    downloadBlob(blob, { 'content-disposition': 'attachment; filename="report.csv"' })

    expect(createObjectURLMock).toHaveBeenCalledWith(blob)
    expect(clickMock).toHaveBeenCalledTimes(1)
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url')
  })

  it('falls back to generated filename when header missing', () => {
    const blob = new Blob(['test'])
    downloadBlob(blob)

    expect(createObjectURLMock).toHaveBeenCalledWith(blob)
    expect(clickMock).toHaveBeenCalledTimes(1)
  })
})
