import { test, expect } from '../test-with-coverage'
import { BASE_URL, TEST_DATA } from '../shared/constants'

test.describe('Login flows', () => {
  // TC-1-1 ログイン
  test('Can login with valid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)

    await page.getByPlaceholder('sample@example.com').fill(TEST_DATA.LOGIN.EMAIL)
    await page.getByPlaceholder('半角英数字20文字以内').fill(TEST_DATA.LOGIN.PASSWORD)
    await page.getByRole('button', { name: 'ログインする' }).click()

    await expect(page.getByText('ログインに成功しました')).toBeVisible()
    await page.waitForURL(`${BASE_URL}/`)

    await expect(page.getByRole('main').getByText('プロジェクト管理')).toBeVisible()

    const companyNameElement = page.getByTestId('company-name')
    await expect(companyNameElement).toBeVisible()
    await expect(companyNameElement).not.toBeEmpty()
  })
})
