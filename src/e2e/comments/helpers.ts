import type { Page } from '@playwright/test'

import { authenticateAndVisit } from '../shared/helpers'

export const getCommentRows = (page: Page) => page.locator('.el-table__body-wrapper tbody tr')

export const waitForCommentsReady = async (page: Page) => {
  await page.waitForFunction(
    () => {
      const loading = document.querySelector('.el-loading-mask')
      return !loading || (loading as HTMLElement).offsetParent === null
    },
    { timeout: 30000 },
  )
}

export const visitComment = async (page: Page) => {
  await authenticateAndVisit(page, '/comments')
  await page.waitForURL(/\/comments/, { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('networkidle')
  await waitForCommentsReady(page)
}

export const goToFirstCommentDetail = async (page: Page) => {
  await waitForCommentsReady(page)
  await page.waitForLoadState('networkidle')

  const dataRows = getCommentRows(page)
  const rowCount = await dataRows.count()

  if (rowCount === 0) {
    return null
  }

  const firstRow = dataRows.first()
  const commentIdCell = firstRow.locator('td').nth(3).locator('span').first()
  const selectedCommentId = (await commentIdCell.innerText()).trim()
  await commentIdCell.click()
  await page.waitForLoadState('networkidle')
  await page.waitForURL(new RegExp(`/comments/${selectedCommentId}$`))

  await page.waitForLoadState('networkidle')

  return { selectedCommentId }
}

export const visitCommentDetail = async (page: Page) => {
  await visitComment(page)

  const detail = await goToFirstCommentDetail(page)

  return detail
}
