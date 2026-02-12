import { test, expect } from '../test-with-coverage'
import { getCustomerRows, visitCustomer } from './helpers'

test.describe('Customer List', () => {
  // TC-6-1 顧客一覧画面へ遷移
  test('customer list page show', async ({ page }) => {
    await visitCustomer(page)

    await expect(page.getByRole('main').getByText('顧客管理', { exact: true })).toBeVisible()
  })

  // TC-6-2 顧客詳細画面へ遷移
  test('navigates to customer detail from customer id link', async ({ page }) => {
    await visitCustomer(page)

    const dataRows = getCustomerRows(page)
    const rowCount = await dataRows.count()
    if (rowCount === 0) return
    const firstRow = dataRows.first()
    const customerIdLink = firstRow.locator('td').first().locator('span').first()

    await customerIdLink.click()
    await page.waitForURL(/\/customers\/[^/]+$/)

    await expect(page.getByText('コメント一覧')).toBeVisible()
    await expect(page.getByText('ニックネーム').first()).toBeVisible()
    await expect(page.getByText('顧客ID').first()).toBeVisible()
  })
})
