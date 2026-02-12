import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { formatDate, isBeforeDay, getDateRangeStatus, formatDateRangeEnd } from '@/util/date-format'
import { DateRangeStatus } from '@/enum'

describe('date-format utilities', () => {
  it('returns dash placeholder when date input is empty', () => {
    // Ensures falsy values fall back to "-".
    expect(formatDate('')).toBe('-')
    expect(formatDate(null as unknown as string)).toBe('-')
    expect(formatDate(undefined as unknown as string)).toBe('-')
  })

  it('formats provided date strings and Date instances with default pattern', () => {
    // Validates string inputs and Date objects produce YYYY-MM-DD or YYYY/MM/DD.
    expect(formatDate('2024-05-20')).toMatch(/2024[\/-]05[\/-]20/)
    expect(formatDate(new Date('2024-12-31T15:00:00Z'))).toBe(formatDate('2024-12-31T15:00:00Z'))
  })

  it('accepts custom format tokens', () => {
    // Confirms custom format strings are forwarded to dayjs.
    expect(formatDate('2024-02-03', 'MM-DD')).toBe('02-03')
  })

  it('returns dash when date string is invalid', () => {
    // New requirement: invalid dates should return '-'
    expect(formatDate('invalid-date-string')).toBe('-')
  })

  it('determines when a date is before another date by day precision', () => {
    // Checks edge cases and confirms day-level comparison ignores time.
    expect(isBeforeDay('2024-01-01', '2024-01-02')).toBe(true)
    expect(isBeforeDay(new Date('2024-01-02T23:59:59Z'), '2024-01-02')).toBe(false)
    expect(isBeforeDay('2024-01-03', '2024-01-02')).toBe(false)
  })

  describe('formatDateRangeEnd', () => {
    it('returns formatted date with separator for valid dates', () => {
      const date = '2024-01-01'
      const formatted = formatDate(date)
      expect(formatDateRangeEnd(date)).toBe(` - ${formatted}`)
    })

    it('returns dash when date is invalid or empty', () => {
      expect(formatDateRangeEnd('invalid-date')).toBe('-')
      expect(formatDateRangeEnd('')).toBe('-')
      expect(formatDateRangeEnd(null as unknown as string)).toBe('-')
    })
  })

  describe('project status utilities', () => {
    // Mock current date for consistent testing
    const mockNow = new Date('2024-02-10T12:00:00Z')

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(mockNow)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    describe('getDateRangeStatus', () => {
      it('returns "not_started" when dates are missing', () => {
        expect(getDateRangeStatus('', '2024-02-15')).toBe(DateRangeStatus.NotStarted)
        expect(getDateRangeStatus('2024-02-05', '')).toBe(DateRangeStatus.NotStarted)
        expect(getDateRangeStatus('', '')).toBe(DateRangeStatus.NotStarted)
      })

      it('returns "not_started" when current time is before start date', () => {
        expect(getDateRangeStatus('2024-02-15', '2024-02-20')).toBe(DateRangeStatus.NotStarted)
      })

      it('returns "ongoing" when current time is between start and end dates', () => {
        expect(getDateRangeStatus('2024-02-05', '2024-02-15')).toBe(DateRangeStatus.Ongoing)
        expect(getDateRangeStatus('2024-02-10', '2024-02-15')).toBe(DateRangeStatus.Ongoing)
      })

      it('returns "ended" when current time is after end date', () => {
        expect(getDateRangeStatus('2024-02-01', '2024-02-05')).toBe(DateRangeStatus.Ended)
      })
    })
  })
})
