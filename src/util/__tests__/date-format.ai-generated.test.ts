import { describe, it, expect } from 'vitest'
import { formatDate, formatDateRangeEnd } from '../date-format'

describe('date-format.ai-generated.test.ts (ai-testgent)', () => {
  it('formatDate returns dash placeholder for invalid date strings', () => {
    expect(formatDate('invalid-date')).toBe('-')
    expect(formatDate('not a date')).toBe('-')
  })

  it('formatDateRangeEnd returns formatted string with separator for valid dates', () => {
    expect(formatDateRangeEnd('2023-01-01')).toBe(' - 2023/01/01')
  })

  it('formatDateRangeEnd returns dash for invalid, empty, or null inputs', () => {
    expect(formatDateRangeEnd('')).toBe('-')
    expect(formatDateRangeEnd(null as unknown as string)).toBe('-')
    expect(formatDateRangeEnd('invalid-date')).toBe('-')
  })
})
