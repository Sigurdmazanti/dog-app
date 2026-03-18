import { styled, RadioGroup } from 'tamagui'

export const CustomRadioGroupItem = styled(RadioGroup.Item, {
  name: 'CustomRadioGroupItem',
  width: 16,
  height: 16,
  borderColor: '$borderColor',
  bg: '$inputBg'
})