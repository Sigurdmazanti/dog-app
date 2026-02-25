import { View } from "react-native";
import { PrimaryButton } from "src/styled/button/PrimaryButton";
import { YStack, XStack, Input, Select, H2 } from "tamagui";
import { BodyText } from "src/styled/text/BodyText";
import { DogFormValues } from "../AddDog.types";
import { useFormContext, useWatch } from "react-hook-form";
import { SelectLista } from "src/components/list/SelectList";
import { useState } from "react";
import { SelectProps } from "tamagui";
import { SelectInput } from "src/components/input/SelectInput";
import { CustomInput } from "src/styled/input/CustomInput";
import { CustomH3 } from "src/styled/headings/CustomH3";
import { CustomInputLabel } from "src/styled/input/CustomInputLabel";

export function StepOne() {
  const { control, setValue } = useFormContext<DogFormValues>()
  const dogName = useWatch<DogFormValues, "dogName">({
    control,
    name: "dogName",
  })

  return (
    <YStack gap="$6" items='center'>
      <CustomH3>Let's get to know your dog</CustomH3>

      <YStack gap="$2" maxW={300} width='100%'>
        <CustomInputLabel>What's the name of your dog?</CustomInputLabel>
        <CustomInput
          bg='$inputBg'
          placeholder="What's the name of your dog?"
          value={dogName}
          onChangeText={(value: string) => setValue("dogName", value)}
        />
      </YStack>
    </YStack>
  )
}