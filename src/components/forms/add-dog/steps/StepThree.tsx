import { BodyText } from "src/styled/text/BodyText"
import { View, YStack, Input } from "tamagui"

export function StepThree({
  dogName,
  setDogName,
}: {
  dogName: string
  setDogName: (val: string) => void
}) {
  return (
    <View items="center" justify="center">
      <YStack gap="$2" items="center">
        <BodyText>Step 3: Dog Name</BodyText>
        <Input
          placeholder="What's the name of your dog?"
          value={dogName}
          onChangeText={(value: string) => {
            setDogName(value)
          }}
          width={300}
        />
      </YStack>
    </View>
  )
}