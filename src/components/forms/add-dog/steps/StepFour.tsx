import { useEffect, useState } from "react"
import { View, Input, Button, YStack, XStack } from "tamagui"
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { BodyText } from "src/styled/text/BodyText"
import { CustomSheet } from "src/components/sheet/CustomSheet"
import { PrimaryButton } from "src/styled/button/PrimaryButton"
import { Platform, Pressable, useColorScheme } from "react-native"

export function StepFour({
  dogDateOfBirth,
  setDogDateOfBirth,
}: {
  dogDateOfBirth: Date | null
  setDogDateOfBirth: (val: Date) => void
}) {
  const [showPicker, setShowPicker] = useState(false)
  const [showInnerPicker, setShowInnerPicker] = useState(false)
  const [tempDate, setTempDate] = useState(
    dogDateOfBirth != null && dogDateOfBirth instanceof Date ? dogDateOfBirth : new Date()
  )
  const colorScheme = useColorScheme() ?? 'light'
  
  const onAndroidPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      setDogDateOfBirth(selectedDate);
      setShowPicker(false);
    }
  };

  return (
    <View items="center" justify="center">
      <YStack gap="$2" items="center">
        <BodyText>Step 4: Date of birth</BodyText>
        <Pressable onPress={() => setShowPicker(true)}>
          <Input
            pointerEvents="none"          // prevents Input from catching touches
            editable={false}
            placeholder="Date of Birth"
            value={
              dogDateOfBirth
                ? new Date(dogDateOfBirth).toLocaleDateString()
                : ""
            }
          />
        </Pressable>

        {/* Android opens up the native datepicker dialog immediately on mount */}
        {Platform.OS == 'android' ? (
          showPicker && (
            <DateTimePicker
              value={tempDate}
              mode="date"
              maximumDate={new Date()}
              onChange={onAndroidPickerChange}
              display={"default"}
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
                    setDogDateOfBirth(tempDate)
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
      </YStack>
    </View>
  )
}