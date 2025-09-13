import { styled, Button } from 'tamagui'

export const TertiaryButton = styled(Button, {
  name: 'TertiaryButton',
  rounded: '$2',
  px: '$4',
  py: '$2',
  borderWidth: 0,
  bg: '$primaryText',
  color: '$background',
  // hoverStyle: {
  //   bg: '$blue3',
  // },

  // pressStyle: {
  //   bg: '$blue2',
  // },

  // disabledStyle: {
  //   bg: '$blue2',
  //   borderColor: '$blue4',
  //   opacity: 0.4,
  // },
})