import { Text, styled } from 'tamagui'

export const BodyText = styled(Text, {
  name: 'BodyText',
  fontFamily: '$body',
  fontSize: '$4',
  color: '$primaryText',

  variants: {
    tone: {
      default: {
        color: '$primaryText',
      },
      disabled: {
        color: '$disabledText',
      },
      inactive: {
        color: '$primaryText',
      }
    } 
  } as const,
  defaultVariants: {
    tone: 'default',
  },
})