import { useFormContext, useWatch } from "react-hook-form";
import { BodyText } from "src/styled/text/BodyText";
import { Input, RadioGroup, View, YStack, XStack } from "tamagui";
import { DogFormValues } from "../AddDog.types";
import { useState } from "react";
import { Platform, Pressable, useColorScheme } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { CustomSheet } from "src/components/sheet/CustomSheet";
import { PrimaryButton } from "src/styled/button/PrimaryButton";
import { DogGender, DogNeuteredOption } from "src/services/dogs/dogs.models";
import { formatDateDMY } from "src/functions/helpers/dateFormatter";
import { SelectInput, SelectItem } from "src/components/input/SelectInput";
import { RadioGroupItem } from "src/components/input/RadioGroupItem";
import { CustomInput } from "src/styled/input/CustomInput";
import { CustomInputLabel } from "src/styled/input/CustomInputLabel";

export function StepTwo() {
	const { control, setValue, getValues } = useFormContext<DogFormValues>()
	const dogName = getValues()?.dogName;
    

	const dogDateOfBirth = useWatch<DogFormValues, "dogDateOfBirth">({
		control,
		name: "dogDateOfBirth",
	})

	const dogGender = useWatch<DogFormValues, "dogGender">({
		control,
		name: "dogGender",
	})

	const dogIsNeutered = useWatch<DogFormValues, "dogIsNeutered">({
		control,
		name: "dogIsNeutered",
	})

	const dogGenderItems: SelectItem<DogGender>[] = [
		{ value: "male", label: "Male" },
		{ value: "female", label: "Female" },
	]

  const dogNeuteredOptions: DogNeuteredOption[] = [
    { value: "yes", label: "Yes", bool: true },
    { value: "no", label: "No", bool: false },
  ];
	
	const [showPicker, setShowPicker] = useState(false)
	const [showInnerPicker, setShowInnerPicker] = useState(false)
	const [tempDate, setTempDate] = useState(
		dogDateOfBirth != null && dogDateOfBirth instanceof Date ? dogDateOfBirth : new Date()
	)
	const colorScheme = useColorScheme() ?? 'light'
	

	const onAndroidPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
		if (event.type === "dismissed") {
			setShowPicker(false)
			return
		}
		if (selectedDate) {
			setValue("dogDateOfBirth", selectedDate)
			setShowPicker(false)
		}
	}
	return (
		<View items="center" justify="center" gap="$6">
			<YStack gap="$2" maxW={300} width='100%'>
				<CustomInputLabel>What gender does {dogName} have?</CustomInputLabel>
        <RadioGroup
          items="center"
          gap="$2.5"
          orientation="vertical"
          value={dogGender ?? undefined}
          onValueChange={(val) => setValue("dogGender", val as DogGender)}
        >
        {dogGenderItems.map((item) => (
          <RadioGroupItem
            key={item.value}
            selected={dogGender === item.value}
            value={item.value}
            label={item.label}
            onSelect={() => setValue("dogGender", item.value)}
          />
        ))}
        </RadioGroup>
      </YStack>

      <YStack gap="$2" maxW={300} width='100%'>
				<CustomInputLabel>When is {dogName}'s birthday?</CustomInputLabel>
				<Pressable onPress={() => setShowPicker(true)}>
          <CustomInput
            pointerEvents="none" // prevents Input from catching touches
            editable={false}
            placeholder="Date of birth"
            value={formatDateDMY(dogDateOfBirth)}
          />
				</Pressable>
      </YStack>

      {/* Android opens up the native datepicker dialog immediately on mount */}
      {Platform.OS == 'android' ? (
        showPicker && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            maximumDate={new Date()}
            onChange={onAndroidPickerChange}
            display="default"
            themeVariant={colorScheme}
          />
        )
      ) : (
        <CustomSheet open={showPicker} setOpen={setShowPicker}>
          {(setShowPicker) => (
            <>
              {showPicker && (
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  maximumDate={new Date()}
                  onChange={(e, selectedDate) => {
                    if (selectedDate) setTempDate(selectedDate)
                  }}
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  themeVariant={colorScheme}
                />
              )}
              <PrimaryButton
                mt="$4"
                onPress={() => {
                  setValue("dogDateOfBirth", tempDate)
                  setShowPicker(false)
                }}
                tone={tempDate ? "success" : "disabled"}
              >
                Confirm
              </PrimaryButton>
            </>
          )}
        </CustomSheet>
      )}

      <YStack gap="$2" maxW={300} width='100%'>
        <CustomInputLabel>Is {dogName} neutered?</CustomInputLabel>
        <RadioGroup
          items="center"
          gap="$2.5"
          orientation="vertical"
          value={dogIsNeutered === true ? "yes" : dogIsNeutered === false ? "no" : undefined}
          onValueChange={(val) => setValue("dogIsNeutered", val === "yes")}
        >
        {dogNeuteredOptions.map((option) => (
          <RadioGroupItem
            key={option.value}
            selected={dogIsNeutered === option.bool}
            value={option.value}
            label={option.label}
            onSelect={() => setValue("dogIsNeutered", option.bool)}
          />
        ))}
        </RadioGroup>
      </YStack>
		</View>
	)
}