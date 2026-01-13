import { View } from "react-native";
import { PrimaryButton } from "src/styled/button/PrimaryButton";
import { YStack, XStack, Text } from "tamagui";
import { BodyText } from "src/styled/text/BodyText";
import { DogBreedType } from "src/services/dogs/dogs.breeds.models";

// const RenderStackedDogIcon = ({ iconSize, isActive }: { iconSize: number, isActive: boolean }) => {
//   const color = isActive ? "$primaryText" : "$text";

//   return (
//     <YStack items='center' height='100%' width={iconSize * 2.5}>
//       <Dog size={iconSize} color={color} position='absolute' t={13.5} l={5}></Dog>
//       <Dog size={iconSize} color={color} position='absolute' t={2}></Dog>
//       <Dog size={iconSize} color={color} position='absolute' t={13.5} r={5}></Dog>
//     </YStack>
//   )
// }

export function StepOne({
  dogBreedType,
  setDogBreedType,
}: {
  dogBreedType: DogBreedType
  setDogBreedType: (val: DogBreedType) => void
}) {
  const iconSize = 15;
  
  return (
    <View>
      <YStack gap="$2" items="center" justify="center">
        <BodyText>Step 1: Dog Type</BodyText>
        <XStack justify='center' flexWrap='wrap' columnGap="$4">
          <PrimaryButton
            onPress={() => {
              setDogBreedType("mixed")
            }}
            tone={dogBreedType === "mixed" ? "success" : "inactive"}
            // icon={<RenderStackedDogIcon iconSize={iconSize} isActive={dogBreedType === "mixed"}/>}
          >
            <BodyText ml={-5} color={dogBreedType === "mixed" ? "$primaryText" : "$text"}>Mixed/cross breed</BodyText>
          </PrimaryButton>
          
          <PrimaryButton
            onPress={() => {
              setDogBreedType("pure")
            }}
            tone={dogBreedType === "pure" ? "success" : "inactive"}
            // icon={<Dog size={18}></Dog>}
          >
            Pure breed
          </PrimaryButton>
        </XStack>
      </YStack>
    </View>
  )
}