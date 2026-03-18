import { styled, Button } from 'tamagui'

export const TertiaryButton = styled(Button, {
  name: 'TertiaryButton',
  rounded: '$2',
  px: '$4',
  py: '$2',
  borderWidth: 0,
  bg: '$primaryText',
  color: '$background',
  fontWeight: '$8',
  // hoverStyle: {
  //   bg: '$blue3',
  // },

  pressStyle: {
    bg: '$primaryText',
    opacity: 0.9
  },

  // disabledStyle: {
  //   bg: '$blue2',
  //   borderColor: '$blue4',
  //   opacity: 0.4,
  // },
})