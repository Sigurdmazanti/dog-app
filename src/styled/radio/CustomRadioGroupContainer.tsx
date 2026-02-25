import { styled, XStack } from 'tamagui'

export const CustomRadioGroupContainer = styled(XStack, {
  name: 'CustomRadioGroupContainer',
  width: '100%',
  maxW: 300,
  bg: '$inputBg',
  items: "center",
  gap: "$2.5",
  rounded: "$4",
  borderWidth: "$0.5",
  borderColor: "$borderColor",
  px: "$2",
  py: 0,

  variants: {
    tone: {
      success: {
        bg: '$primary',
        pressStyle: {
          bg: '$primary',
          opacity: 0.75,
        },
      },
      disabled: {
        bg: '$disabledBg',
        pressStyle: {
          bg: '$disabledBg',
          opacity: 0.75,
        },
      },
      inactive: {
        bg: '$inputBg',
        pressStyle: {
          bg: '$inputBg',
          opacity: 0.75,
        },
      }
    } 
  } as const,
  defaultVariants: {
    tone: 'inactive',
  },
})