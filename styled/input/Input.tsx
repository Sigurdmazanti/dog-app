import { styled, Input } from 'tamagui'

export const CustomInput = styled(Input, {
  name: 'CustomInput',
  borderWidth: 0,
  rounded: "$4",
  bg: 'transparent',
  fontSize: '$4',
  placeholderTextColor: '$placeholderText',
} as const)
