import { useFormContext, useWatch } from "react-hook-form"
import { YStack, View } from "tamagui"
import { DogFormValues } from "../AddDog.types"
import { CustomInputLabel } from "src/styled/input/CustomInputLabel"
import { BorderedInput } from "src/components/input/BorderedInput"
import { SelectInput } from "src/components/input/SelectInput"
import { DogActivityLevel } from "src/services/dogs/dogs.models"

export function StepFour() {
  const { control, setValue, resetField, getValues } = useFormContext<DogFormValues>()
  const dogName = getValues()?.dogName;
  const dogWeightKg = useWatch<DogFormValues, "dogWeightKg">({ control, name: "dogWeightKg" })
  const dogTargetWeightKg = useWatch<DogFormValues, "dogTargetWeightKg">({ control, name: "dogTargetWeightKg" })
  const dogActivityLevel = useWatch<DogFormValues, "dogActivityLevel">({ control, name: "dogActivityLevel" })

  // TODO: store this somewhere that is not plain text 
  const physicalFormOptions: { value: DogActivityLevel; label: string }[] = [
    { value: "very_inactive", label: "Very inactive" },
    { value: "inactive", label: "Inactive" },
    { value: "moderately_active", label: "Moderately active" },
    { value: "active", label: "Active" },
    { value: "very_active", label: "Very active" },
  ];

  return (
    <View items="center" justify="center" gap="$6">
      <YStack gap="$2" maxW={300} width="100%">
        <CustomInputLabel>{dogName}'s physical form</CustomInputLabel>
        <SelectInput
          value={dogActivityLevel !== undefined && dogActivityLevel !== null ? String(dogActivityLevel) : ''}
          items={physicalFormOptions}
          groupHeader="Physical form"
          onChange={val => setValue("dogActivityLevel", val as DogActivityLevel)}
        />
      </YStack>

      <YStack gap="$2" maxW={300} width="100%">
        <CustomInputLabel>{dogName}'s weight</CustomInputLabel>
        <BorderedInput
          keyboardType="numeric"
          value={dogWeightKg !== undefined && dogWeightKg !== null ? String(dogWeightKg) : ''}
          valueType="kg"
          placeholder="Enter weight..."
          onChangeText={val => {
            const num = val.replace(/[^0-9.]/g, '')
            if (val === '') {
              setValue("dogWeightKg", undefined)
              return
            }
            setValue("dogWeightKg", num ? Number(num) : undefined)
          }} />

      </YStack>

      <YStack gap="$2" maxW={300} width="100%">
        <CustomInputLabel>{dogName}'s target weight</CustomInputLabel>
        <BorderedInput
          keyboardType="numeric"
          placeholder="Enter target weight..."
          valueType="kg"
          value={dogTargetWeightKg !== undefined && dogTargetWeightKg !== null ? String(dogTargetWeightKg) : ''}
          onChangeText={val => {
            const num = val.replace(/[^0-9.]/g, '')
            if (val === '') {
              setValue("dogTargetWeightKg", undefined)
              return
            }
            setValue("dogTargetWeightKg", num ? Number(num) : undefined)
          }}
        />
      </YStack>
      {/*
      <YStack gap="$2" maxW={300} width="100%">
        <CustomInputLabel>{dogName}'s height</CustomInputLabel>
        <BorderedInput
          valueType="cm"
          keyboardType="numeric"
          placeholder="Enter height..."
          value={dogHeightCm !== undefined && dogHeightCm !== null ? String(dogHeightCm) : ''}
          onChangeText={val => {
            const num = val.replace(/[^0-9.]/g, '')
            if (val === '') {
              setValue("dogHeightCm", undefined)
              return
            }
            setValue("dogHeightCm", num ? Number(num) : undefined)
          }}
        />
      </YStack>

      <YStack gap="$2" maxW={300} width="100%">
        <CustomInputLabel>{dogName}'s target weight (kg)</CustomInputLabel>
        <BorderedInput
          keyboardType="numeric"
          placeholder="Enter target weight..."
          valueType="kg"
          value={dogTargetWeightKg !== undefined && dogTargetWeightKg !== null ? String(dogTargetWeightKg) : ''}
          onChangeText={val => {
            const num = val.replace(/[^0-9.]/g, '')
            if (val === '') {
              setValue("dogTargetWeightKg", undefined)
              return
            }
            setValue("dogTargetWeightKg", num ? Number(num) : undefined)
          }}
        />
      </YStack>
      */}
    </View>
  )
}