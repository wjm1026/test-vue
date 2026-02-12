import { describe, expect, it } from 'vitest'

import { SortOrder } from '@/enum'
import {
  createListMockHandler,
  dataSort,
  textFilter,
  paginate,
} from '@/mocks/processors/mocksHandler'

type SampleItem = {
  id: number
  name: string
  value: number
}

describe('textFilter', () => {
  it('filters items by keyword with case insensitivity (single field)', () => {
    // Confirm only items containing the keyword regardless of case remain.
    const items: SampleItem[] = [
      { id: 1, name: 'Alpha', value: 5 },
      { id: 2, name: 'beta', value: 10 },
      { id: 3, name: 'Gamma', value: 15 },
    ]

    const result = textFilter(items, 'BET', 'name')

    expect(result).toEqual([{ id: 2, name: 'beta', value: 10 }])
  })

  it('filters items by keyword with multiple fields', () => {
    // Confirm filtering works across multiple fields.
    const items: SampleItem[] = [
      { id: 1, name: 'Alpha', value: 5 },
      { id: 2, name: 'beta', value: 10 },
      { id: 3, name: 'Gamma', value: 15 },
    ]

    const result = textFilter(items, '5', ['name', 'value'])

    expect(result).toEqual([
      { id: 1, name: 'Alpha', value: 5 },
      { id: 3, name: 'Gamma', value: 15 },
    ])
  })

  it('returns an empty array when no items match the keyword', () => {
    // Ensure no entries are retained when the keyword does not exist.
    const items: SampleItem[] = [
      { id: 1, name: 'Alpha', value: 5 },
      { id: 2, name: 'Beta', value: 10 },
    ]

    const result = textFilter(items, 'delta', 'name')

    expect(result).toEqual([])
  })
})

describe('paginate', () => {
  it('returns a slice for the requested page and size', () => {
    // Validate that the correct slice is produced for the second page.
    const items: SampleItem[] = [
      { id: 1, name: 'One', value: 1 },
      { id: 2, name: 'Two', value: 2 },
      { id: 3, name: 'Three', value: 3 },
      { id: 4, name: 'Four', value: 4 },
    ]

    const result = paginate(items, 2, 2)

    expect(result).toEqual([
      { id: 3, name: 'Three', value: 3 },
      { id: 4, name: 'Four', value: 4 },
    ])
  })

  it('falls back to defaults when page and size are omitted', () => {
    // Confirm default pagination returns the leading subset.
    const items: SampleItem[] = [
      { id: 1, name: 'One', value: 1 },
      { id: 2, name: 'Two', value: 2 },
      { id: 3, name: 'Three', value: 3 },
    ]

    const result = paginate(items)

    expect(result).toEqual(items)
  })
})

describe('dataSort', () => {
  it('returns the original array when sort field is missing', () => {
    // Ensure the input array reference is preserved when no sorting occurs.
    const items: SampleItem[] = [
      { id: 2, name: 'Beta', value: 10 },
      { id: 1, name: 'Alpha', value: 5 },
    ]

    const result = dataSort(items)

    expect(result).toBe(items)
  })

  it('sorts numeric values in ascending and descending order', () => {
    // Verify ascending and descending behavior for numeric fields.
    const items: SampleItem[] = [
      { id: 1, name: 'C', value: 3 },
      { id: 2, name: 'A', value: 1 },
      { id: 3, name: 'B', value: 2 },
    ]

    const asc = dataSort(items, 'value', SortOrder.Asc)
    const desc = dataSort(items, 'value', SortOrder.Desc)

    expect(asc.map((item) => item.value)).toEqual([1, 2, 3])
    expect(desc.map((item) => item.value)).toEqual([3, 2, 1])
  })

  it('sorts string values alphabetically by default', () => {
    // Confirm string sorting defaults to ascending order.
    const items: SampleItem[] = [
      { id: 1, name: 'Charlie', value: 1 },
      { id: 2, name: 'Alpha', value: 1 },
      { id: 3, name: 'Bravo', value: 1 },
    ]

    const result = dataSort(items, 'name')

    expect(result.map((item) => item.name)).toEqual(['Alpha', 'Bravo', 'Charlie'])
  })
})

describe('createListMockHandler', () => {
  it('filters, sorts, paginates, and rewrites totals', () => {
    // Check that filtering, sorting, and pagination update both list and total.
    const items: SampleItem[] = [
      { id: 1, name: 'Alpha', value: 3 },
      { id: 2, name: 'Beta', value: 10 },
      { id: 3, name: 'beta-max', value: 7 },
      { id: 4, name: 'Gamma', value: 1 },
    ]
    const handler = createListMockHandler<
      SampleItem,
      { total: number; items: SampleItem[] },
      'total',
      'items'
    >('name', 'total', 'items')
    const response = {
      total: items.length,
      items,
    }
    const result = handler(response, {
      params: {
        query: 'beta',
        sortKey: 'value',
        sortOrder: SortOrder.Desc,
        limit: 1,
        offset: 0,
      },
    })

    expect(result.total).toBe(2)
    expect(result.items).toEqual([{ id: 2, name: 'Beta', value: 10 }])
  })

  it('applies defaults when query parameters are missing', () => {
    // Validate the handler leaves data intact when no query parameters are provided.
    const items: SampleItem[] = [
      { id: 1, name: 'Alpha', value: 3 },
      { id: 2, name: 'Beta', value: 10 },
    ]
    const handler = createListMockHandler<
      SampleItem,
      { total: number; items: SampleItem[] },
      'total',
      'items'
    >('name', 'total', 'items')
    const response = {
      total: items.length,
      items,
    }
    const result = handler(response, { params: {} })

    expect(result.total).toBe(items.length)
    expect(result.items).toEqual(items)
  })

  describe('date range filtering', () => {
    type DateItem = {
      id: number
      name: string
      startDate: string
      endDate: string
    }

    it('filters items by startDate when provided', () => {
      // Verify items ending before the filter start date are excluded.
      const items: DateItem[] = [
        { id: 1, name: 'Before', startDate: '2025-01-01', endDate: '2025-01-05' },
        { id: 2, name: 'Overlap', startDate: '2025-01-10', endDate: '2025-01-15' },
        { id: 3, name: 'After', startDate: '2025-01-20', endDate: '2025-01-25' },
      ]
      const handler = createListMockHandler<
        DateItem,
        { total: number; items: DateItem[] },
        'total',
        'items'
      >('name', 'total', 'items', {
        startDateField: 'startDate',
        endDateField: 'endDate',
      })
      const response = {
        total: items.length,
        items,
      }
      const result = handler(response, {
        params: {
          startDate: '2025-01-08',
        },
      })

      expect(result.total).toBe(2)
      expect(result.items.map((item: DateItem) => item.id)).toEqual([2, 3])
    })

    it('filters items by endDate when provided', () => {
      // Verify items starting after the filter end date are excluded.
      const items: DateItem[] = [
        { id: 1, name: 'Before', startDate: '2025-01-01', endDate: '2025-01-05' },
        { id: 2, name: 'Overlap', startDate: '2025-01-10', endDate: '2025-01-15' },
        { id: 3, name: 'After', startDate: '2025-01-20', endDate: '2025-01-25' },
      ]
      const handler = createListMockHandler<
        DateItem,
        { total: number; items: DateItem[] },
        'total',
        'items'
      >('name', 'total', 'items', {
        startDateField: 'startDate',
        endDateField: 'endDate',
      })
      const response = {
        total: items.length,
        items,
      }
      const result = handler(response, {
        params: {
          endDate: '2025-01-18',
        },
      })

      expect(result.total).toBe(2)
      expect(result.items.map((item: DateItem) => item.id)).toEqual([1, 2])
    })

    it('filters items by both startDate and endDate when provided', () => {
      // Verify items are filtered correctly when both dates are provided.
      const items: DateItem[] = [
        { id: 1, name: 'Before', startDate: '2025-01-01', endDate: '2025-01-05' },
        { id: 2, name: 'Overlap', startDate: '2025-01-10', endDate: '2025-01-15' },
        { id: 3, name: 'After', startDate: '2025-01-20', endDate: '2025-01-25' },
      ]
      const handler = createListMockHandler<
        DateItem,
        { total: number; items: DateItem[] },
        'total',
        'items'
      >('name', 'total', 'items', {
        startDateField: 'startDate',
        endDateField: 'endDate',
      })
      const response = {
        total: items.length,
        items,
      }
      const result = handler(response, {
        params: {
          startDate: '2025-01-08',
          endDate: '2025-01-18',
        },
      })

      expect(result.total).toBe(1)
      expect(result.items.map((item: DateItem) => item.id)).toEqual([2])
    })

    it('includes items without date fields when date filtering is applied', () => {
      // Verify items missing date fields are included (no date constraints).
      type ItemWithOptionalDates = {
        id: number
        name: string
        startDate?: string
        endDate?: string
      }
      const items: ItemWithOptionalDates[] = [
        { id: 1, name: 'NoDates' },
        { id: 2, name: 'WithDates', startDate: '2025-01-10', endDate: '2025-01-15' },
        { id: 3, name: 'PartialDates', startDate: '2025-01-20' },
      ]
      const handler = createListMockHandler<
        ItemWithOptionalDates,
        { total: number; items: ItemWithOptionalDates[] },
        'total',
        'items'
      >('name', 'total', 'items', {
        startDateField: 'startDate',
        endDateField: 'endDate',
      })
      const response = {
        total: items.length,
        items,
      }
      const result = handler(response, {
        params: {
          startDate: '2025-01-08',
          endDate: '2025-01-18',
        },
      })

      // Items without dates should be included, items with dates should be filtered.
      expect(result.total).toBe(2)
      expect(result.items.map((item: ItemWithOptionalDates) => item.id)).toEqual([1, 2])
    })

    it('handles partial overlap correctly', () => {
      // Verify items that partially overlap with the filter range are included.
      const items: DateItem[] = [
        { id: 1, name: 'StartsBefore', startDate: '2025-01-01', endDate: '2025-01-12' },
        { id: 2, name: 'EndsAfter', startDate: '2025-01-14', endDate: '2025-01-25' },
        { id: 3, name: 'FullyInside', startDate: '2025-01-10', endDate: '2025-01-15' },
        { id: 4, name: 'FullyOutside', startDate: '2025-01-20', endDate: '2025-01-25' },
      ]
      const handler = createListMockHandler<
        DateItem,
        { total: number; items: DateItem[] },
        'total',
        'items'
      >('name', 'total', 'items', {
        startDateField: 'startDate',
        endDateField: 'endDate',
      })
      const response = {
        total: items.length,
        items,
      }
      const result = handler(response, {
        params: {
          startDate: '2025-01-08',
          endDate: '2025-01-18',
        },
      })

      // All items except FullyOutside should be included (they all overlap).
      expect(result.total).toBe(3)
      expect(result.items.map((item: DateItem) => item.id)).toEqual([1, 2, 3])
    })
  })
})
