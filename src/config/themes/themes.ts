import { customTokens } from "./../tokens/tokens"
import { defaultThemes } from '@tamagui/themes/v4'

export const customThemes = {
  ...defaultThemes,
  light: {
    background: customTokens.color.backgroundLight,
    cardBackground: customTokens.color.cardBackgroundLight,
    text: customTokens.color.textLight,
    primary: customTokens.color.primaryLight,
    primaryHover: customTokens.color.primaryHoverLight,
    primaryText: customTokens.color.primaryTextLight,
    primaryTextAccent: customTokens.color.primaryTextAccentLight,
    backdrop: customTokens.color.backdropLight,
    danger: customTokens.color.dangerLight,
    disabledBg: customTokens.color.disabledBgLight,
    disabledText: customTokens.color.disabledTextLight,
    placeholderText: customTokens.color.placeholderTextLight,
    borderColor: customTokens.color.borderColorLight
  },
  dark: {
    background: customTokens.color.backgroundDark,
    cardBackground: customTokens.color.cardBackgroundDark,
    text: customTokens.color.textDark,
    primary: customTokens.color.primaryDark,
    primaryHover: customTokens.color.primaryHoverDark,
    primaryText: customTokens.color.primaryTextDark,
    primaryTextAccent: customTokens.color.primaryTextAccentDark,
    backdrop: customTokens.color.backdropDark,
    danger: customTokens.color.dangerDark,
    disabledBg: customTokens.color.disabledBgDark,
    disabledText: customTokens.color.disabledTextDark,
    placeholderText: customTokens.color.placeholderTextDark,
    borderColor: customTokens.color.borderColorDark
  },
}