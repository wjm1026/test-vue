import type { Page } from '@playwright/test'

import { test, expect } from '../test-with-coverage'
import { visitProductCreate, getProductRows, waitForProductsReady } from './helpers'
import { TEST_DATA } from '../shared/constants'
import { generateRandomJanCode } from '../shared/helpers'

const createProduct = async (
  page: Page,
  productName: string,
  makerName: string,
  janCode: string,
  description = '季節限定の検証用商品です。',
) => {
  const productNameInput = page.getByPlaceholder('商品名を入力')
  const makerInput = page.getByPlaceholder('メーカー名を入力')
  const janInput = page.getByPlaceholder('JANコードを入力')
  const categorySelect = page
    .locator('.el-form-item')
    .filter({ hasText: '商品カテゴリ' })
    .locator('.el-select')
  const descriptionField = page.getByPlaceholder('400文字以内で入力').nth(0)

  await productNameInput.fill(productName)
  await makerInput.fill(makerName)
  await janInput.fill(janCode)

  await expect(categorySelect).toBeVisible()
  await categorySelect.click()
  const categoryDropdown = page.locator('.el-select-dropdown').last()
  await categoryDropdown.waitFor({ state: 'visible' })
  const firstCategoryOption = categoryDropdown.locator('.el-select-dropdown__item').first()
  await firstCategoryOption.waitFor({ state: 'visible' })
  await firstCategoryOption.click()

  await descriptionField.fill(description)
}

test.describe('Product Create', () => {
  // TC-2-3 商品情報を登録
  test('create a product', async ({ page }) => {
    await visitProductCreate(page)
    const productName = TEST_DATA.PRODUCT.NAME

    const randomJanCode = generateRandomJanCode()
    await createProduct(page, productName, TEST_DATA.PRODUCT.MAKER, randomJanCode)
    const submitButton = page.getByRole('button', { name: '登録する' })
    await expect(submitButton).toBeEnabled()

    await submitButton.click()
    await page.waitForLoadState('networkidle')

    const successDialog = page.getByRole('dialog').filter({ hasText: '商品が登録されました' })
    await expect(successDialog).toBeVisible()

    // TC-2-4 商品一覧画面へ遷移
    await successDialog.getByRole('button', { name: '閉じる' }).click()
    await page.waitForURL(/\/products$/, { timeout: 10000 })
    await expect(page.getByRole('main').getByText('商品管理', { exact: true })).toBeVisible()

    const searchInput = page.getByPlaceholder('商品名、メーカー名、JANコードで絞り込み')
    await expect(searchInput).toBeVisible()
    await searchInput.fill(productName)

    await page.waitForTimeout(1000)
    await waitForProductsReady(page)

    const productRows = getProductRows(page)
    await expect(productRows.first()).toBeVisible()
  })
})
