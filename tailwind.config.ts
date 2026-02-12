import type { Config } from 'tailwindcss'

import { themeConfig } from './src/shared/theme'

const config: Config = {
  important: true,
  content: ['./src/**/*.{vue,ts,tsx,js,jsx,html}'],
  theme: {
    extend: {
      colors: themeConfig.color,
    },
  },
}

export default config
