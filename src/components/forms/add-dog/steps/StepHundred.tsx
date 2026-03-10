import { useFormContext, useWatch } from "react-hook-form"
import { BodyText } from "src/styled/text/BodyText"
import { View, YStack, Input } from "tamagui"
import { DogFormValues } from "../AddDog.types"

export function StepThree() {
  const { control, setValue } = useFormContext<DogFormValues>()

  const dogName = useWatch<DogFormValues, "dogName">({
    control,
    name: "dogName",
  })

  return (
    <View items="center" justify="center">
      <YStack gap="$2" items="center">
        <BodyText>Step 3: Dog Name</BodyText>
        <Input
          placeholder="What's the name of your dog?"
          value={dogName}
          onChangeText={(value: string) => setValue("dogName", value)}
        />
      </YStack>
    </View>
  )
}