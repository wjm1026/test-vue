import type { Page } from '@playwright/test'

import { test, expect } from '../test-with-coverage'
import { BASE_URL, TEST_DATA } from '../shared/constants'
import { fillDatePicker } from '../shared/helpers'
import { visitProjectEdit } from './helpers'

const editProject = async (
  page: Page,
  selectedProjectId: string,
  options: {
    canEditName: boolean
    canEditDates: boolean
    canEditPoints: boolean
    canEditProducts: boolean
    canEditPriority: boolean
  },
) => {
  const projectNameInput = page.getByPlaceholder('名称未設定')

  await page.waitForFunction(
    () => {
      const loadingElements = document.querySelectorAll('.el-loading-mask, .el-loading-spinner')
      return loadingElements.length === 0
    },
    { timeout: 15000 },
  )

  await expect(projectNameInput).toBeVisible({ timeout: 10000 })

  if (options.canEditName) {
    const isEnabled = await projectNameInput.isEnabled()
    if (isEnabled) {
      await expect(projectNameInput).not.toHaveValue('')
      const updatedName = `${selectedProjectId}（編集）`
      await projectNameInput.fill(updatedName)
    }
  }

  if (options.canEditDates) {
    const startDatePicker = page.getByRole('combobox', { name: '開始日' })
    const endDatePicker = page.getByRole('combobox', { name: '終了日' })

    if (await startDatePicker.isEnabled()) {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '/')
      await fillDatePicker(page, '開始日', today)
    }
    if (await endDatePicker.isEnabled()) {
      await fillDatePicker(page, '終了日', '2026/04/25')
    }
  }

  if (options.canEditPoints) {
    const pointInput = page
      .locator('.el-form-item')
      .filter({ hasText: '付与ポイント' })
      .getByRole('textbox')

    if (await pointInput.isEnabled()) {
      await pointInput.fill('100')
    }
  }

  if (options.canEditProducts) {
    const productSelectButton = page.getByRole('button', { name: '商品一覧から選ぶ' })
    if (await productSelectButton.isEnabled()) {
      await productSelectButton.click()
      const targetDialog = page.getByRole('dialog').filter({ hasText: '対象商品設定' })
      await expect(targetDialog).toBeVisible()
      await targetDialog.locator('.el-loading-mask').first().waitFor({ state: 'detached' })
      await targetDialog.locator('.el-radio').first().click()
      await targetDialog.getByRole('button', { name: '設定する' }).click()
      await expect(targetDialog).toBeHidden()
    }
  }

  if (options.canEditPriority) {
    const prioritySwitch = page
      .locator('.el-form-item')
      .filter({ hasText: 'プロジェクトの優先表示' })
      .locator('.el-switch')

    if (await prioritySwitch.isEnabled()) {
      const priorityInput = page
        .locator('.el-form-item')
        .filter({ hasText: 'プロジェクトの優先表示' })
        .getByPlaceholder('1~10の値を入力')

      const isSwitchChecked = await prioritySwitch.locator('.el-switch__input').isChecked()
      if (!isSwitchChecked) {
        await prioritySwitch.click()
      }

      if (await priorityInput.isEnabled()) {
        await expect(priorityInput).toBeEnabled()
        await priorityInput.fill(TEST_DATA.PROJECT.PRIORITY_VALUE)
      }
    }
  }
}

test.describe('Project Edit', () => {
  // TC-3-7 プロジェクト情報を編集
  test('edits a project', async ({ page }) => {
    const editDetail = await visitProjectEdit(page)
    if (!editDetail) {
      return
    }
    const { selectedProjectId } = editDetail

    const isProjectStarted = await page.evaluate(() => {
      const input = document.querySelector(
        'input[placeholder="名称未設定"]',
      ) as HTMLInputElement | null
      return input && input.disabled
    })

    const editOptions = {
      canEditName: !isProjectStarted,
      canEditDates: !isProjectStarted,
      canEditPoints: !isProjectStarted,
      canEditProducts: !isProjectStarted,
      canEditPriority: true,
    }

    await editProject(page, selectedProjectId, editOptions)
    const submitButton = page.getByRole('button', { name: '作成する' })
    await expect(submitButton).toBeEnabled()
    await submitButton.click()

    const successDialog = page.getByRole('dialog').filter({ hasText: /プロジェクトが.*されました/ })
    await expect(successDialog).toBeVisible()

    // TC-3-8 プロジェクト一覧画面へ遷移
    await successDialog.getByRole('button', { name: '閉じる' }).click()
    await page.waitForURL(`${BASE_URL}/`)
    await expect(
      page.getByRole('main').getByText('プロジェクト管理', { exact: true }),
    ).toBeVisible()
  })
})
