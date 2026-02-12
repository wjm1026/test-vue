import type { Page } from '@playwright/test'

import { test, expect } from '../test-with-coverage'
import { BASE_URL, TEST_DATA } from '../shared/constants'
import { fillDatePicker } from '../shared/helpers'
import { visitProjectCreate, getProjectRows, waitForProjectsReady } from './helpers'

const createProject = async (
  page: Page,
  projectName: string,
  pointValue: string,
  enablePriority = false,
  startDate: string = '2026/03/03',
  endDate: string = '2026/04/25',
  priorityValue?: string,
) => {
  const loadingMask = page.locator('.el-loading-mask')
  await loadingMask.waitFor({ state: 'detached' })

  await page.waitForLoadState('networkidle')

  const projectNameInput = page.getByPlaceholder('名称未設定')
  await expect(projectNameInput).toBeVisible()
  await projectNameInput.fill(projectName)

  await fillDatePicker(page, '開始日', startDate)
  await fillDatePicker(page, '終了日', endDate)

  await page.getByRole('button', { name: '商品一覧から選ぶ' }).click()
  const targetDialog = page.getByRole('dialog').filter({ hasText: '対象商品設定' })
  await expect(targetDialog).toBeVisible()
  await targetDialog.locator('.el-loading-mask').first().waitFor({ state: 'detached' })

  const searchInput = targetDialog.getByPlaceholder('商品名、メーカー名、JANコードで絞り込み')
  await expect(searchInput).toBeVisible()
  await searchInput.fill(TEST_DATA.PRODUCT.NAME)

  await page.waitForTimeout(1000)

  await targetDialog.locator('.el-radio').first().click()
  await targetDialog.getByRole('button', { name: '設定する' }).click()
  await expect(targetDialog).toBeHidden()

  const pointInput = page
    .locator('.el-form-item')
    .filter({ hasText: '付与ポイント' })
    .getByRole('textbox')
  await pointInput.fill(pointValue)

  if (enablePriority) {
    await expect(page.getByText('オプション')).toBeVisible()
    await expect(page.getByText('プロジェクトの優先表示')).toBeVisible()

    const prioritySwitch = page
      .locator('.el-form-item')
      .filter({ hasText: 'プロジェクトの優先表示' })
      .locator('.el-switch')
    const priorityInput = page
      .locator('.el-form-item')
      .filter({ hasText: 'プロジェクトの優先表示' })
      .getByPlaceholder('1~10の値を入力')

    await expect(priorityInput).toBeDisabled()

    await prioritySwitch.click()
    await expect(priorityInput).toBeEnabled()

    if (priorityValue) {
      await priorityInput.fill(priorityValue)
    }
  }
}

test.describe('Project Create', () => {
  // TC-3-3 プロジェクト情報を登録
  test('create a project', async ({ page }) => {
    await visitProjectCreate(page)

    const projectName = TEST_DATA.PROJECT.NAME
    await createProject(
      page,
      projectName,
      TEST_DATA.PROJECT.POINT_VALUE,
      TEST_DATA.PROJECT.PRIORITY_FLAG,
      TEST_DATA.PROJECT.START_DATE,
      TEST_DATA.PROJECT.END_DATE,
      TEST_DATA.PROJECT.PRIORITY_VALUE,
    )
    const submitButton = page.getByRole('button', { name: '作成する' })
    await submitButton.click()

    const successDialog = page
      .getByRole('dialog')
      .filter({ hasText: 'プロジェクトが作成されました' })
    await expect(successDialog).toBeVisible()

    // TC-3-4 プロジェクト一覧画面へ遷移
    await successDialog.getByRole('button', { name: '閉じる' }).click()
    await page.waitForURL(`${BASE_URL}/`)
    await expect(
      page.getByRole('main').getByText('プロジェクト管理', { exact: true }),
    ).toBeVisible()

    const searchInput = page.getByPlaceholder('プロジェクト名、商品名で絞り込み')
    await expect(searchInput).toBeVisible()
    await searchInput.fill(projectName)

    await page.waitForTimeout(1000)
    await waitForProjectsReady(page)

    const projectRows = getProjectRows(page)
    await expect(projectRows.first()).toBeVisible()
  })
})
