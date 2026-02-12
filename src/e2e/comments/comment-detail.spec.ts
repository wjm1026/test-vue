import { test, expect } from '../test-with-coverage'
import { visitCommentDetail } from './helpers'

test.describe('Comment Detail', () => {
  test('comment reply workflow', async ({ page }) => {
    const detail = await visitCommentDetail(page)
    await page.waitForLoadState('networkidle')

    if (!detail) return

    const replyButton = page.getByRole('button', { name: 'コメントに返信する' })

    if ((await replyButton.count()) === 0) return
    await expect(replyButton).toBeVisible()

    // TC-5-5 コメント返信画面へ遷移
    await replyButton.click()

    await expect(page.getByRole('dialog').filter({ hasText: 'コメント返信' })).toBeVisible()
    await expect(page.getByPlaceholder('400文字以内でコメントを入力してください')).toBeVisible()
    await expect(page.getByRole('button', { name: '送信する' })).toBeVisible()

    // TC-5-6 コメント返信登録
    const inputContent = 'これはテスト返信です。ご確認ください。'
    await page.getByPlaceholder('400文字以内でコメントを入力してください').fill(inputContent)

    await page.getByRole('button', { name: '送信する' }).click()

    await expect(
      page.getByRole('dialog').filter({ hasText: 'コメントが送信されました' }),
    ).toBeVisible()

    // TC-5-7 コメント詳細へ遷移
    await page.getByRole('button', { name: '閉じる' }).click()

    await expect(page.getByText('コメントID:')).toBeVisible()
    await expect(page.getByText('コメント', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('プロジェクトID')).toBeVisible()
  })
})
