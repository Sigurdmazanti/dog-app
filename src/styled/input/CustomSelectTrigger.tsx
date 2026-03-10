import { styled, Select } from 'tamagui'

export const CustomSelectTrigger = styled(Select.Trigger, {
  name: 'CustomSelectTrigger',
  height: 44,
  rounded: '$3',
  borderWidth: '$0.5',
  borderColor: '$borderColor',
  bg: '$inputBg',
  py: 0,
  pl: '$4',
  outline: 'none',
  boxShadow: 'none',
  shadowColor: 'transparent',
})