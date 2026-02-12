import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'

import viteConfig from './vite.config'

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        environment: 'jsdom',
        setupFiles: ['vitest.setup.ts'],
        css: true,
        server: {
          deps: {
            inline: ['element-plus', '@element-plus/icons-vue'],
          },
        },
        exclude: [...configDefaults.exclude, 'src/e2e/**'],
        coverage: {
          provider: 'v8',
          include: ['src/**/*.{ts,tsx,vue}'],
          exclude: ['src/e2e/**', 'src/__tests__/**'],
        },
      },
    }),
  ),
)
