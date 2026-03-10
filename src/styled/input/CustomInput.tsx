import { styled, Input } from 'tamagui'

export const CustomInput = styled(Input, {
  name: 'CustomInput',
  height: 44,
  borderWidth: '$0.5',
  rounded: '$3',
  bg: '$inputBg',
  fontSize: '$4',
  placeholderTextColor: '$placeholderText',
  width: '100%',
  maxW: 300,
  pl: '$4',
} as const)
