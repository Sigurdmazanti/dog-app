import { createTokens } from "tamagui"
import { tokens as defaultTokens } from '@tamagui/themes/v4'

export const customTokens = createTokens({
  ...defaultTokens,
  color: {
    backgroundLight: '#FAFAF7',
    cardBackgroundLight: '#FFFFFF',
    textLight: '#000000',
    primaryLight: '#2ECC71',
    primaryHoverLight: '#27AE60',
    primaryTextLight: '#000000',
    primaryTextAccentLight: '#ffffff',
    backdropLight: 'rgba(0, 0, 0, 0.4)',
    dangerLight: '#E63946',
    disabledBgLight: '#EBEBEB',
    disabledTextLight: '#9E9E9E',
    placeholderTextLight: '#9E9E9E',
    borderColorLight: '#D1D5DB',

    backgroundDark: '#1F1F1F',
    cardBackgroundDark: '#2C2C2C',
    textDark: '#EDEDED',
    primaryDark: '#58D68D',
    primaryHoverDark: '#45B76E',
    primaryTextDark: '#FFFFFF',
    primaryTextAccentDark: '#000',
    backdropDark: 'rgba(0, 0, 0, 0.4)',
    dangerDark: '#F66969',
    disabledBgDark: '#2F2F2F',
    disabledTextDark: '#EDEDED',
    placeholderTextDark: '#9E9E9E',
    borderColorDark: '#D1D5DB'
  },
})