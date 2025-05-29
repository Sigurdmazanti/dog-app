import { defaultConfig } from '@tamagui/config/v4'
import { createFont, createTamagui } from 'tamagui'

// const headingFont = createFont({
//   family: 'System',
//   size: {
//     1: 13,
//     2: 14,
//     3: 16,
//     4: 18,
//     5: 20,
//     true: 16,
//   },
//   lineHeight: {
//     1: 17,
//     2: 22,
//     3: 25,
//     true: 17,
//   },
//   weight: {
//     4: '400',
//     5: '500',
//     7: '700',
//     8: '800',
//     true: '500',
//   },
//   letterSpacing: {
//     4: 0,
//     5: 0,
//     7: -0.5,
//     true: 0,
//   },
// });

// const bodyFont = createFont({
//   family: 'System',
//   size: {
//     1: 13,
//     2: 14,
//     3: 16,
//     4: 18,
//     true: 12,
//   },
//   lineHeight: {
//     1: 17,
//     2: 22,
//     3: 25,
//     true: 17,
//   },
//   weight: {
//     4: '400',
//     5: '500',
//     7: '700',
//     8: '800',
//     true: '300',
//   },
//   letterSpacing: {
//     4: 0,
//     5: 0,
//     7: -0.5,
//     true: 0,
//   },
// });

export const config = createTamagui({
  ...defaultConfig,
  // fonts: {
  //   heading: headingFont,
  //   body: bodyFont,
  // },
});

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
