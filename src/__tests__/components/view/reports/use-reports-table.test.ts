// generated-by: ai-assist v1.0
// type: unit
// description: Tests for useReportsTable navigation helpers.

import { beforeEach, describe, expect, it, vi } from 'vitest'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

describe('useReportsTable', () => {
  beforeEach(() => {
    vi.resetModules()
    pushMock.mockReset()
  })

  it('exposes reportDetailHandle and reportDailyHandle functions', async () => {
    // Purpose: confirm composable API shape stays consistent.
    const { useReportsTable } = await import('@/components/view/reports/useReportsTable')
    const result = useReportsTable()

    expect(typeof result.reportDetailHandle).toBe('function')
    expect(typeof result.reportDailyHandle).toBe('function')
  })

  it('navigates to report detail route with provided project id', async () => {
    // Purpose: ensure reportDetailHandle builds correct router payload.
    const { routeNames } = await import('@/router/routes')
    const { useReportsTable } = await import('@/components/view/reports/useReportsTable')
    const { reportDetailHandle } = useReportsTable()

    reportDetailHandle(42)

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({
      name: routeNames.reports.detail,
      params: { id: '42' },
    })
  })

  it('navigates to report detail route with daily query when invoking reportDailyHandle', async () => {
    // Purpose: verify reportDailyHandle sets the daily query flag.
    const { routeNames } = await import('@/router/routes')
    const { useReportsTable } = await import('@/components/view/reports/useReportsTable')
    const { reportDailyHandle } = useReportsTable()

    reportDailyHandle(77)

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({
      name: routeNames.reports.detail,
      params: { id: '77' },
      query: { type: 'daily' },
    })
  })
})
