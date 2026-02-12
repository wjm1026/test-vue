import { test, expect } from '../test-with-coverage'
import { getProjectRows, visitProject } from './helpers'

test.describe('Project List', () => {
  // TC-3-1 プロジェクト一覧画面へ遷移
  test('project list page show', async ({ page }) => {
    await visitProject(page)

    await page.getByText('商品管理', { exact: true }).click()
    await page.waitForURL(/\/products/)

    await page.getByText('プロジェクト管理', { exact: true }).click()
    await expect(
      page.getByRole('main').getByText('プロジェクト管理', { exact: true }),
    ).toBeVisible()
  })

  // TC-3-2 プロジェクト登録画面へ遷移
  test('navigates to project create page from create button', async ({ page }) => {
    await visitProject(page)

    await page.getByRole('button', { name: '新規作成' }).click()
    await page.waitForURL(/\/projects\/create/)

    await expect(page.getByPlaceholder('名称未設定')).toBeVisible()
  })

  // TC-3-5 プロジェクト詳細画面へ遷移
  test('navigates to project detail from project name link', async ({ page }) => {
    await visitProject(page)

    const dataRows = getProjectRows(page)
    const rowCount = await dataRows.count()
    if (rowCount === 0) return
    const firstRow = dataRows.first()
    const productNameLink = firstRow.locator('td').nth(4).locator('span').first()

    await productNameLink.click()
    await page.waitForURL(/\/products\/[^/]+$/)

    await expect(page.getByText('概要情報')).toBeVisible()
    await expect(page.getByText('商品名').first()).toBeVisible()
    await expect(page.getByText('メーカー').first()).toBeVisible()
    await expect(page.getByText('JANコード').first()).toBeVisible()
  })
})
