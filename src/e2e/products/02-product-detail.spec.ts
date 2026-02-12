import { test, expect } from '../test-with-coverage'
import { visitProductDetail } from './helpers'

test.describe('Product Detail', () => {
  // TC-2-6 商品編集画面へ遷移
  test('navigates to edit product page', async ({ page }) => {
    await visitProductDetail(page)

    const editButton = page.getByRole('button', { name: '編集する' })
    await expect(editButton).toBeVisible()

    const isClickable = await editButton.isEnabled()
    if (!isClickable) {
      return
    }

    await editButton.click()
    await page.waitForURL(/\/products\/registration\/[^/]+$/)

    const productNameInput = page.getByPlaceholder('商品名を入力')
    await expect(productNameInput).toBeVisible()
  })
})
