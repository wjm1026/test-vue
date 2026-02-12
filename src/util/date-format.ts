import dayjs from 'dayjs'

import { DateRangeStatus } from '@/enum'

export const formatDate = (date: string | Date, format = 'YYYY/MM/DD') => {
  if (!date) return '-'
  return dayjs(date).format(format)
}

export const isBeforeDay = (date: Date | string, targetDate: Date | string): boolean => {
  return dayjs(date).isBefore(dayjs(targetDate), 'day')
}

export const addDays = (date: Date | string, days: number): Date => {
  return dayjs(date).add(days, 'day').toDate()
}

export const subtractDays = (date: Date | string, days: number): Date => {
  return dayjs(date).subtract(days, 'day').toDate()
}

export const formatDateRangeEnd = (date: string | Date): string => {
  return ` - ${formatDate(date)}`
}

export const getDateRangeStatus = (
  startDate: string | Date,
  endDate: string | Date,
): DateRangeStatus => {
  if (!startDate || !endDate) return DateRangeStatus.NotStarted

  const now = dayjs()
  const start = dayjs(startDate)
  const end = dayjs(endDate)

  if (now.isBefore(start, 'day')) return DateRangeStatus.NotStarted
  if (now.isBefore(end, 'day')) return DateRangeStatus.Ongoing
  return DateRangeStatus.Ended
}
