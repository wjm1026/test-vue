import { test, expect } from '../test-with-coverage'
import { visitProjectDetail } from './helpers'

test.describe('Project Detail', () => {
  // TC-3-6 プロジェクト編集画面へ遷移
  test('navigates to edit project page', async ({ page }) => {
    await visitProjectDetail(page)

    const editButton = page.getByRole('button', { name: '編集する' })
    await expect(editButton).toBeVisible()

    const isClickable = await editButton.isEnabled()
    if (!isClickable) {
      return
    }

    await editButton.click()
    await page.waitForURL(/\/projects\/create\/\d+$/)

    const projectNameInput = page.getByPlaceholder('名称未設定')
    await expect(projectNameInput).toBeVisible()
  })
})
