import type { Page } from '@playwright/test'

import { test, expect } from '../test-with-coverage'
import { visitProductEdit, getProductRows, waitForProductsReady } from './helpers'

const editProduct = async (page: Page, selectedProductName: string) => {
  const loadingMask = page.locator('.el-loading-mask')
  await loadingMask.waitFor({ state: 'detached' })

  const productNameInput = page.getByPlaceholder('商品名を入力')
  await expect(productNameInput).toBeVisible()
  await expect(productNameInput).not.toHaveValue('')

  const updatedName = `${selectedProductName}编辑`
  await productNameInput.fill(updatedName)
}

test.describe('Product Edit', () => {
  test('edits a product', async ({ page }) => {
    const editDetail = await visitProductEdit(page)
    if (!editDetail) return
    const { selectedProductName } = editDetail

    await editProduct(page, selectedProductName)
    const submitButton = page.getByRole('button', { name: '登録する' })
    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    const successDialog = page.getByRole('dialog').filter({ hasText: '商品が登録されました' })
    await expect(successDialog).toBeVisible()

    // TC-2-8 商品一覧画面へ遷移
    await successDialog.getByRole('button', { name: '閉じる' }).click()
    await page.waitForURL(/\/products$/, { timeout: 10000 })
    await expect(page.getByRole('main').getByText('商品管理', { exact: true })).toBeVisible()

    const searchInput = page.getByPlaceholder('商品名、メーカー名、JANコードで絞り込み')
    await expect(searchInput).toBeVisible()
    await searchInput.fill(`${selectedProductName}编辑`)

    await page.waitForTimeout(1000)
    await waitForProductsReady(page)

    const productRows = getProductRows(page)
    await expect(productRows.first()).toBeVisible()
  })
})
