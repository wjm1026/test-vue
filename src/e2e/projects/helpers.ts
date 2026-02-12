import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'

import { authenticateAndVisit } from '../shared/helpers'
import { TEST_DATA } from '../shared/constants'

export const getProjectRows = (page: Page) => page.locator('.el-table__body-wrapper tbody tr')

export const waitForProjectsReady = async (page: Page) => {
  await page.waitForFunction(
    () => {
      const loading = document.querySelector('.el-loading-mask')
      return !loading || (loading as HTMLElement).offsetParent === null
    },
    { timeout: 30000 },
  )
}

export const visitProject = async (page: Page) => {
  await authenticateAndVisit(page, '/')
  await page.waitForURL(/\/$/)
  await waitForProjectsReady(page)
}

export const visitProjectCreate = async (page: Page) => {
  await visitProject(page)

  await page.getByRole('button', { name: '新規作成' }).click()
  await page.waitForURL(/\/projects\/create/)
}

export const visitProjectDetail = async (page: Page) => {
  await visitProject(page)

  const searchInput = page.getByPlaceholder('プロジェクト名、商品名で絞り込み')
  await expect(searchInput).toBeVisible()
  await searchInput.fill(TEST_DATA.PROJECT.NAME)

  await page.waitForTimeout(1000)
  await waitForProjectsReady(page)

  const dataRows = getProjectRows(page)

  if ((await dataRows.count()) === 0) {
    return null
  }

  const targetRow = dataRows.first()
  await expect(targetRow).toBeVisible()

  const projectIdCell = targetRow
    .locator('td')
    .nth(1)
    .locator('span')
    .filter({ hasText: /\d+/ })
    .first()
  await expect(projectIdCell).toBeVisible()
  const selectedProjectId = (await projectIdCell.innerText()).trim()

  await projectIdCell.click()
  await page.waitForURL(new RegExp(`/projects/${selectedProjectId}$`))

  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle')

  return { selectedProjectId }
}

export const visitProjectEdit = async (page: Page) => {
  const detail = await visitProjectDetail(page)
  if (!detail) {
    return null
  }
  const { selectedProjectId } = detail

  const editButton = page.getByRole('button', { name: '編集する' })
  try {
    await expect(editButton).toBeVisible({ timeout: 5000 })
    const isClickable = await editButton.isEnabled()
    if (!isClickable) {
      return null
    }

    await editButton.click({ timeout: 5000 })
    await page.waitForURL(/\/projects\/create\/\d+$/, { timeout: 10000 })
  } catch {
    return null
  }

  return { selectedProjectId }
}
