import { styled, Label } from 'tamagui'

export const CustomLabel = styled(Label, {
  name: 'CustomLabel',
  fontSize: '$4',
  fontWeight: '$6',
  color: '$primaryText',
  m: 0,
  p: 0
} as const)
