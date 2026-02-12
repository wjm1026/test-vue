// generated-by: ai-assist v1.0
// type: unit
// description: useReportsPage tests covering default state, API wiring, and pagination behavior.

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref, type Ref } from 'vue'

import { SortOrder, defaultPage, pageSize } from '@/enum'

const reportListRef = ref<unknown>(null)
const isLoadingRef = ref(false)

const useReportListApiMock = vi.hoisted(() =>
  vi.fn(() => ({
    reportList: reportListRef,
    isLoading: isLoadingRef,
  })),
)

vi.mock('@/hooks/useReportListApi', () => ({
  useReportListApi: useReportListApiMock,
}))

vi.mock('@/hooks/useDebouncedRef', () => ({
  useDebouncedRef: <T>(source: { value: T }) => source,
}))

type DayjsMock = {
  format: (format: string) => string
  isAfter: (other: Date | string | DayjsMock, unit?: string) => boolean
  isBefore: (other: Date | string | DayjsMock, unit?: string) => boolean
  $d: Date
  valueOf: () => number
}

vi.mock('dayjs', () => {
  const dayjs = (date?: string | Date): DayjsMock => {
    const d = date ? (date instanceof Date ? date : new Date(date)) : new Date()
    const formatDate = (format: string): string => {
      if (format === 'YYYY-MM-DD') {
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      return d.toISOString()
    }
    const isAfter = (other: Date | string | DayjsMock, unit?: string): boolean => {
      let otherDate: Date
      if (other instanceof Date) {
        otherDate = other
      } else if (typeof other === 'string') {
        otherDate = new Date(other)
      } else if (other && typeof other === 'object' && 'valueOf' in other) {
        // other is a dayjs object, extract the date
        otherDate = (other as { $d?: Date }).$d || new Date()
      } else {
        otherDate = new Date()
      }
      if (unit === 'day') {
        const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        const oDate = new Date(otherDate.getFullYear(), otherDate.getMonth(), otherDate.getDate())
        return dDate > oDate
      }
      return d > otherDate
    }
    const isBefore = (other: Date | string | DayjsMock, unit?: string): boolean => {
      let otherDate: Date
      if (other instanceof Date) {
        otherDate = other
      } else if (typeof other === 'string') {
        otherDate = new Date(other)
      } else if (other && typeof other === 'object' && 'valueOf' in other) {
        // other is a dayjs object, extract the date
        otherDate = (other as { $d?: Date }).$d || new Date()
      } else {
        otherDate = new Date()
      }
      if (unit === 'day') {
        const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        const oDate = new Date(otherDate.getFullYear(), otherDate.getMonth(), otherDate.getDate())
        return dDate < oDate
      }
      return d < otherDate
    }
    const dayjsObj: DayjsMock = {
      format: formatDate,
      isAfter,
      isBefore,
      $d: d,
      valueOf: () => d.getTime(),
    }
    return dayjsObj
  }
  return { default: dayjs }
})

async function createComposable() {
  vi.resetModules()
  useReportListApiMock.mockClear()
  const module = await import('@/views/reports/useReportsPage')
  return module.useReportsPage()
}

describe('useReportsPage', () => {
  beforeEach(() => {
    reportListRef.value = { total: 0, reports: [] }
    isLoadingRef.value = false
  })

  it('initializes filters, sorting, and exposes API refs', async () => {
    // Purpose: verify default ref values and API passthrough.
    const composable = await createComposable()

    expect(composable.searchKeyword.value).toBe('')
    expect(composable.startDate.value).toBe('')
    expect(composable.endDate.value).toBe('')
    expect(composable.sortField.value).toBe('')
    expect(composable.sortOrder.value).toBe(SortOrder.Asc)
    expect(composable.reportList.value).toEqual({ total: 0, reports: [] })
    expect(composable.isLoading.value).toBe(false)
  })

  it('configures useReportListApi with reactive params and updates offset when page changes', async () => {
    // Purpose: ensure API hook receives refs and offset follows pagination.
    const composable = await createComposable()

    expect(useReportListApiMock).toHaveBeenCalledTimes(1)
    const callArgs = useReportListApiMock.mock.calls[0]
    expect(callArgs).toBeDefined()
    expect(callArgs?.length).toBeGreaterThanOrEqual(2)
    const [params, pageRef] = callArgs as unknown as [
      {
        offset: ReturnType<typeof computed>
        query: Ref<string>
        sortKey: Ref<string>
        sortOrder: Ref<SortOrder>
        startDate: ReturnType<typeof computed>
        endDate: ReturnType<typeof computed>
      },
      Ref<number>,
    ]

    expect(params.query).toBe(composable.searchKeyword)
    expect(params.sortKey).toBe(composable.sortField)
    expect(params.sortOrder).toBe(composable.sortOrder)
    expect(pageRef.value).toBe(defaultPage)
    expect(params.offset.value).toBe(0)

    composable.pageChange(3)
    expect(pageRef.value).toBe(3)
    expect(params.offset.value).toBe((3 - 1) * pageSize)
  })

  it('formats startDate and endDate for API when dates are provided', async () => {
    // Purpose: verify date formatting converts dates to YYYY-MM-DD format.
    const composable = await createComposable()

    composable.startDate.value = '2024-01-15T10:30:00Z'
    composable.endDate.value = '2024-02-20T15:45:00Z'

    const callArgs = useReportListApiMock.mock.calls[0]
    const [params] = callArgs as unknown as [
      {
        startDate: ReturnType<typeof computed>
        endDate: ReturnType<typeof computed>
      },
    ]

    expect(params.startDate.value).toBe('2024-01-15')
    expect(params.endDate.value).toBe('2024-02-20')
  })

  it('returns empty string for formatted dates when dates are not provided', async () => {
    // Purpose: ensure empty dates result in empty formatted strings.
    const composable = await createComposable()

    composable.startDate.value = ''
    composable.endDate.value = ''

    const callArgs = useReportListApiMock.mock.calls[0]
    const [params] = callArgs as unknown as [
      {
        startDate: ReturnType<typeof computed>
        endDate: ReturnType<typeof computed>
      },
    ]

    expect(params.startDate.value).toBe('')
    expect(params.endDate.value).toBe('')
  })

  it('disableStartDate returns false when endDate is not set', async () => {
    // Purpose: verify start date is not disabled when end date is empty.
    const composable = await createComposable()

    composable.endDate.value = ''
    const testDate = new Date('2024-01-15')

    expect(composable.disableStartDate(testDate)).toBe(false)
  })

  it('disableStartDate returns true when date is after endDate', async () => {
    // Purpose: ensure start date after end date is disabled.
    const composable = await createComposable()

    composable.endDate.value = '2024-01-15'
    const testDate = new Date('2024-01-16')

    expect(composable.disableStartDate(testDate)).toBe(true)
  })

  it('disableStartDate returns false when date is before or equal to endDate', async () => {
    // Purpose: verify start date before or equal to end date is enabled.
    const composable = await createComposable()

    composable.endDate.value = '2024-01-15'
    const beforeDate = new Date('2024-01-14')
    const equalDate = new Date('2024-01-15')

    expect(composable.disableStartDate(beforeDate)).toBe(false)
    expect(composable.disableStartDate(equalDate)).toBe(false)
  })

  it('disableEndDate returns false when startDate is not set', async () => {
    // Purpose: verify end date is not disabled when start date is empty.
    const composable = await createComposable()

    composable.startDate.value = ''
    const testDate = new Date('2024-01-15')

    expect(composable.disableEndDate(testDate)).toBe(false)
  })

  it('disableEndDate returns true when date is before startDate', async () => {
    // Purpose: ensure end date before start date is disabled.
    const composable = await createComposable()

    composable.startDate.value = '2024-01-15'
    const testDate = new Date('2024-01-14')

    expect(composable.disableEndDate(testDate)).toBe(true)
  })

  it('disableEndDate returns false when date is after or equal to startDate', async () => {
    // Purpose: verify end date after or equal to start date is enabled.
    const composable = await createComposable()

    composable.startDate.value = '2024-01-15'
    const afterDate = new Date('2024-01-16')
    const equalDate = new Date('2024-01-15')

    expect(composable.disableEndDate(afterDate)).toBe(false)
    expect(composable.disableEndDate(equalDate)).toBe(false)
  })
})
