// import merge from 'lodash-es/merge'

import { colors as defaultColors } from './default-colors'
import { colors as orangeColors } from './orange-colors'

export const themeConfig = {
  color: {
    ...defaultColors,
    ...orangeColors,
  },
} as const
