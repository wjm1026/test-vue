/// <reference types="node" />

import { test as base, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

type CoveragePayload = Record<string, unknown>

// Extend Playwright's test to capture Istanbul coverage after each test
const test = base.extend({})

test.afterEach(async ({ page }, testInfo) => {
  const coverage = await page.evaluate<CoveragePayload | null>(() => {
    const w = window as typeof window & { __coverage__?: CoveragePayload }
    return w.__coverage__ ?? null
  })

  if (!coverage) {
    return
  }

  const outputDir = '.nyc_output'
  fs.mkdirSync(outputDir, { recursive: true })

  const safeTitle = testInfo.title.replace(/[^a-z0-9\-]+/gi, '_')
  const filename = path.join(
    outputDir,
    `playwright-coverage-${testInfo.project.name}-${safeTitle}.json`,
  )

  fs.writeFileSync(filename, JSON.stringify(coverage))
})

export { test, expect }
