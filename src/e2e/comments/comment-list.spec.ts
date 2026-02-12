import { test, expect } from '../test-with-coverage'
import { getCommentRows, visitComment, waitForCommentsReady } from './helpers'

test.describe('Comment List', () => {
  // TC-5-1 コメント一覧画面へ遷移
  test('comment list page show', async ({ page }) => {
    await visitComment(page)
    await expect(page.getByRole('main').getByText('コメント管理')).toBeVisible()
  })

  // TC-5-2 コメントをチェック
  test('checks comment', async ({ page }) => {
    await visitComment(page)
    await page.waitForLoadState('networkidle')

    const dataRows = getCommentRows(page)
    const rowCount = await dataRows.count()
    if (rowCount === 0) return

    const firstRow = dataRows.first()
    const checkIcon = firstRow.locator('td').nth(0).locator('.cursor-pointer').first()

    const checkedSvg = checkIcon.locator('.check-icon--checked')
    const uncheckedSvg = checkIcon.locator('.check-icon--unchecked')
    const initialIsChecked = await checkedSvg.isVisible()

    await checkIcon.click()
    await page.waitForTimeout(1000)

    if (initialIsChecked) {
      await expect(checkedSvg).not.toBeVisible()
      await expect(uncheckedSvg).toBeVisible()
    } else {
      await expect(checkedSvg).toBeVisible()
      await expect(uncheckedSvg).not.toBeVisible()
    }
  })

  // TC-5-3 表示設定を切替
  test('toggles display setting', async ({ page }) => {
    await visitComment(page)

    const dataRows = getCommentRows(page)
    const rowCount = await dataRows.count()
    if (rowCount === 0) return
    const firstRow = dataRows.first()
    const toggleSwitch = firstRow.locator('td').nth(2).locator('.el-switch').first()

    const initialState = await toggleSwitch.locator('.el-switch__input').isChecked()

    await toggleSwitch.click()
    await page.waitForSelector('.el-icon.is-loading', { state: 'visible', timeout: 15000 })
    await page.waitForSelector('.el-icon.is-loading', { state: 'hidden', timeout: 100000 })

    await page.waitForLoadState('networkidle')
    await waitForCommentsReady(page)

    const afterFirstState = await toggleSwitch.locator('.el-switch__input').isChecked()
    await expect(afterFirstState).not.toBe(initialState)
  })

  // TC-5-4 コメント詳細画面へ遷移
  test('navigates to comment detail from comment id link', async ({ page }) => {
    await visitComment(page)

    const dataRows = getCommentRows(page)
    const rowCount = await dataRows.count()
    if (rowCount === 0) return
    const firstRow = dataRows.first()
    const commentIdLink = firstRow.locator('td').nth(3).locator('span').first()

    await commentIdLink.click()
    await page.waitForURL(/\/comments\/[^/]+$/)

    await expect(page.getByText('コメントID:')).toBeVisible()
  })
})
