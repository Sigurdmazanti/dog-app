import { styled } from 'tamagui'
import { Button } from 'tamagui'

export const PrimaryButton = styled(Button, {
  name: 'PrimaryButton',
  rounded: '$2',
  px: '$4',
  py: '$2',
  borderWidth: 0,

  variants: {
    tone: {
      success: {
        bg: '$primary',
        color: '$primaryText',
        pressStyle: {
          bg: '$primary',
          opacity: 0.75,
        },
      },
      disabled: {
        bg: '$disabledBg',
        color: '$disabledText',
        pressStyle: {
          bg: '$disabledBg',
          opacity: 0.75,
        },
      },
      inactive: {
        bg: '$disabledBg',
        color: '$text',
        pressStyle: {
          bg: '$disabledBg',
        },
      }
    } 
  },
  defaultVariants: {
    tone: 'success',
  },
} as const)
