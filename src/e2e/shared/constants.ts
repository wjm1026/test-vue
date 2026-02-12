const env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
  .process?.env
export const BASE_URL = env?.PLAYWRIGHT_BASE_URL ?? 'http://localhost:8001'

export const TEST_DATA = {
  LOGIN: {
    EMAIL: 'valid_representative@example.com',
    PASSWORD: 'valid!admin',
  },
  PRODUCT: {
    NAME: 'テスト商品',
    MAKER: 'テストメーカー',
  },
  PROJECT: {
    NAME: 'テストプロジェクト',
    POINT_VALUE: '250',
    PRIORITY_FLAG: true,
    PRIORITY_VALUE: '5',
    PRIORITY_EDIT_VALUE: '3',
    START_DATE: '2026/03/03',
    END_DATE: '2026/04/25',
  },
} as const
