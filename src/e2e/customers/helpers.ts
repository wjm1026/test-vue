import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { authenticateAndVisit } from '../shared/helpers'

export const getCustomerRows = (page: Page) => page.locator('.el-table__body-wrapper tbody tr')

export const waitForCustomersReady = async (page: Page) => {
  await page.waitForFunction(
    () => {
      const loading = document.querySelector('.el-loading-mask')
      return !loading || (loading as HTMLElement).offsetParent === null
    },
    { timeout: 30000 },
  )
}

export const visitCustomer = async (page: Page) => {
  await authenticateAndVisit(page, '/customers')
  await page.waitForURL(/\/customers$/)
  await waitForCustomersReady(page)
}

export const goToFirstCustomerDetail = async (page: Page) => {
  const dataRows = getCustomerRows(page)

  const rowCount = await dataRows.count()
  if (rowCount === 0) {
    return null
  }

  const firstRow = dataRows.first()
  const customerLink = firstRow.locator('td').first().locator('span').first()
  await expect(customerLink).toBeVisible()
  await customerLink.click()

  const detailUrlPattern = /\/customers\/([^/]+)$/
  await page.waitForURL(detailUrlPattern)
  const match = page.url().match(detailUrlPattern)
  const selectedCustomerId = match?.[1] ?? ''

  return { selectedCustomerId }
}

export const visitCustomerDetail = async (page: Page) => {
  await visitCustomer(page)

  const detail = await goToFirstCustomerDetail(page)

  return detail
}
