import { test, expect } from '../test-with-coverage'
import { getProductRows, visitProduct } from './helpers'

test.describe('Product List', () => {
  // TC-2-1 商品一覧画面へ遷移
  test('product list page show', async ({ page }) => {
    await visitProduct(page)

    await page.getByRole('menuitem', { name: 'プロジェクト管理' }).click()
    await page.waitForURL(/\//)

    await page.getByRole('menuitem', { name: '商品管理' }).click()
    await expect(page.getByRole('main').getByText('商品管理', { exact: true })).toBeVisible()
  })

  // TC-2-2 商品登録画面へ遷移
  test('navigates to product create page from create button', async ({ page }) => {
    await visitProduct(page)

    await page.getByRole('button', { name: '個別登録' }).click()
    await page.waitForURL(/\/products\/registration/)

    await expect(page.getByPlaceholder('商品名を入力')).toBeVisible()
  })

  // TC-2-5 商品詳細画面へ遷移
  test('navigates to product detail from product name link', async ({ page }) => {
    await visitProduct(page)

    const dataRows = getProductRows(page)
    const rowCount = await dataRows.count()
    if (rowCount === 0) return
    const firstRow = dataRows.first()
    const productNameLink = firstRow.locator('td').nth(1).locator('span').first()

    await productNameLink.click()
    await page.waitForURL(/\/products\/[^/]+$/)

    await expect(page.getByText('概要情報')).toBeVisible()
    await expect(page.getByText('商品名').first()).toBeVisible()
    await expect(page.getByText('メーカー').first()).toBeVisible()
    await expect(page.getByText('JANコード').first()).toBeVisible()
  })
})
