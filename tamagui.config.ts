/*
 *
 * IMPORTANT:
 * Everything is copied from Tamagui v1.126.13
 * customThemes + customTokens are created manually
 * https://github.com/tamagui/tamagui/blob/main/code/core/config/src/v4.ts
 * 
 */ 

// TODO: FIX IMPORTS
// CLEAN UP FOR WEB

import { shorthands } from '@tamagui/shorthands/v4'
import type { CreateTamaguiProps } from '@tamagui/web'
import { createTamagui } from 'tamagui'
import { customTokens } from './config/tokens/tokens'
import { customThemes } from './config/themes/themes'
import { animations } from './config/default/v3-animations'
import { fonts } from './config/default/v4-fonts'
import { media, mediaQueryDefaultActive } from './config/default/v4-media'

export { shorthands } from '@tamagui/shorthands/v4'
export { createThemes } from '@tamagui/theme-builder'
export { tamaguiThemes, tokens } from '@tamagui/themes/v4'
export { animations } from './config/default/v4-animations'
export { createSystemFont, fonts } from './config/default/v4-fonts'
export { breakpoints, media, mediaQueryDefaultActive } from './config/default/v4-media'

export const settings = {
  mediaQueryDefaultActive,
  defaultFont: 'body',
  fastSchemeChange: true,
  shouldAddPrefersColorThemes: false, // <-- Disable OS-based theme switching
  allowedStyleValues: 'somewhat-strict-web',
  themeClassNameOnRoot: true,
  onlyAllowShorthands: true,
  // allow two inverses (tooltips, etc)
  // TODO on inverse theme changes
  maxDarkLightNesting: 2,
} satisfies CreateTamaguiProps['settings']

const configObj = {
  animations,
  media,
  shorthands,
  themes: customThemes,
  tokens: customTokens,
  fonts,
  settings,
} satisfies CreateTamaguiProps

export type Conf = typeof config
export const config = createTamagui(configObj)

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
