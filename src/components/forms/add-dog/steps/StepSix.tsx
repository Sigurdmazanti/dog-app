import { View } from "react-native";
import { PrimaryButton } from "src/styled/button/PrimaryButton";
import { YStack, XStack } from "tamagui";
import { BodyText } from "src/styled/text/BodyText";
import { DogFormValues } from "../AddDog.types";
import { useFormContext, useWatch } from "react-hook-form";

export function StepSix() {
  const iconSize = 15;
  const { control, setValue } = useFormContext<DogFormValues>()
  const dogBreedType = useWatch<DogFormValues, "dogBreedType">({
    control,
    name: "dogBreedType",
  });
  
  return (
    <View>
      <YStack gap="$2" items="center" justify="center">
        <BodyText>Step 1: Dog Type</BodyText>
        <XStack justify='center' flexWrap='wrap' columnGap="$4">
          <PrimaryButton
            onPress={() => setValue("dogBreedType", "mixed")}
            tone={dogBreedType === "mixed" ? "success" : "inactive"}
          >
            <BodyText ml={-5} color={dogBreedType === "mixed" ? "$primaryText" : "$text"}>Mixed/cross breed</BodyText>
          </PrimaryButton>
          
          <PrimaryButton
            onPress={() => setValue("dogBreedType", "pure")}
            tone={dogBreedType === "pure" ? "success" : "inactive"}
          >
            Pure breed
          </PrimaryButton>
        </XStack>
      </YStack>
    </View>
  )
}