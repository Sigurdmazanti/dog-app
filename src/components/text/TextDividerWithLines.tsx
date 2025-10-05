import { XStack, Text, StackProps } from 'tamagui'

type TextDividerProps = {
  text: string
}

export function TextDividerWithLines({ text }: TextDividerProps) {
  return (
    <XStack items="center" gap="$2">
      <XStack flex={1} height={1} bg="$borderColor" />
      <Text fontSize="$3" color="$primaryText">{text}</Text>
      <XStack flex={1} height={1} bg="$borderColor" />
    </XStack>
  )
}
