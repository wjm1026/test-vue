import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'

import { authenticateAndVisit } from '../shared/helpers'
import { TEST_DATA, BASE_URL } from '../shared/constants'

export const getProductRows = (page: Page) => page.locator('.el-table__body-wrapper tbody tr')

export const waitForProductsReady = async (page: Page) => {
  await page.waitForFunction(
    () => {
      const loading = document.querySelector('.el-loading-mask')
      return !loading || (loading as HTMLElement).offsetParent === null
    },
    { timeout: 30000 },
  )
}

export const visitProduct = async (page: Page) => {
  await authenticateAndVisit(page, '/products')
  await page.waitForURL(/\/products$/)
  await waitForProductsReady(page)
}

export const visitProductCreate = async (page: Page) => {
  await visitProduct(page)

  await page.getByRole('button', { name: '個別登録' }).click()
  await page.waitForURL(`${BASE_URL}/products/registration`, {
    waitUntil: 'domcontentloaded',
  })

  const loadingMask = page.locator('.el-loading-mask')
  await loadingMask.waitFor({ state: 'detached' })

  await page.waitForLoadState('networkidle')
}

export const visitProductDetail = async (page: Page) => {
  await visitProduct(page)

  const searchInput = page.getByPlaceholder('商品名、メーカー名、JANコードで絞り込み')
  await expect(searchInput).toBeVisible()
  await searchInput.fill(TEST_DATA.PRODUCT.NAME)

  await page.waitForTimeout(1000)
  await waitForProductsReady(page)

  const dataRows = getProductRows(page)

  if ((await dataRows.count()) === 0) {
    return null
  }

  const targetRow = dataRows.first()
  await expect(targetRow).toBeVisible()

  const productNameCell = targetRow.locator('td').nth(1).locator('span').first()
  await expect(productNameCell).toBeVisible()
  const selectedProductName = (await productNameCell.innerText()).trim()

  await productNameCell.click()
  await page.waitForURL(/\/products\/[^/]+$/)

  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle')

  return { selectedProductName }
}

export const visitProductEdit = async (page: Page) => {
  const detail = await visitProductDetail(page)
  if (!detail) {
    return null
  }
  const { selectedProductName } = detail

  const editButton = page.getByRole('button', { name: '編集する' })
  try {
    await expect(editButton).toBeVisible({ timeout: 5000 })
    const isClickable = await editButton.isEnabled()
    if (!isClickable) {
      return null
    }

    await editButton.click({ timeout: 5000 })
    await page.waitForURL(/\/products\/registration\/[^/]+$/, { timeout: 10000 })
  } catch {
    return null
  }

  return { selectedProductName }
}
