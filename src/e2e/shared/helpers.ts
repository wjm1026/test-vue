import type { Page } from '@playwright/test'

import { BASE_URL, TEST_DATA } from './constants'

export const waitForProgressHidden = async (page: Page) => {
  await page.waitForLoadState('networkidle')
  await page
    .locator('[data-testid="progress"]')
    .waitFor({ state: 'hidden' })
    .catch(() => {})
}

export const authenticateAndVisit = async (page: Page, url: string) => {
  const targetUrl = url.startsWith('/') ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`

  await page.goto(`${BASE_URL}/login`)
  await waitForProgressHidden(page)

  // If already redirected to root, we are logged in
  if (page.url() === `${BASE_URL}/` || page.url() === `${BASE_URL}`) {
    if (url !== '/') {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded' })
    }
    return
  }

  await page.getByPlaceholder('sample@example.com').fill(TEST_DATA.LOGIN.EMAIL)
  await page.getByPlaceholder('半角英数字20文字以内').fill(TEST_DATA.LOGIN.PASSWORD)

  // Use Promise.all to catch the navigation triggered by the click
  // and use a more flexible regex for the root URL
  await Promise.all([
    page.waitForURL(new RegExp(`^${BASE_URL}/?$`), { timeout: 30000 }),
    page.getByRole('button', { name: 'ログインする' }).click(),
  ])

  if (url !== '/') {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' })
  }

  await page.waitForTimeout(1000)
}

export const fillDatePicker = async (page: Page, label: string, value: string) => {
  const picker = page.getByRole('combobox', { name: label })
  await picker.waitFor({ state: 'visible' })
  await picker.click()

  // BaseDatePicker has :editable="false", so we must force the value via DOM
  await picker.evaluate((el, val) => {
    const input = el.querySelector('input') || (el as HTMLInputElement)
    input.value = val
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, value)

  // Click outside to close the picker and ensure any blur/change logic runs
  await page.mouse.click(0, 0)
}

export const generateRandomJanCode = (digits: number = 13): string => {
  const min = Math.pow(10, digits - 1)
  const max = Math.pow(10, digits) - 1
  const randomJanCode = Math.floor(Math.random() * (max - min + 1)) + min
  return randomJanCode.toString()
}
