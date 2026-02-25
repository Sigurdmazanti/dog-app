import { styled } from 'tamagui'
import { BodyText } from '../text/BodyText'

export const CustomInputLabel = styled(BodyText, {
  name: 'CustomInputLabel',
  fontWeight: '$7',
  fontSize: '$4'
} as const)
