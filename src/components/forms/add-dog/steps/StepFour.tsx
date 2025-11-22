import { useState } from "react"
import { View, Input, Button, YStack, XStack } from "tamagui"
import DateTimePicker from '@react-native-community/datetimepicker'
import { BodyText } from "src/styled/text/BodyText"
import { CustomSheet } from "src/components/sheet/CustomSheet"
import { PrimaryButton } from "src/styled/button/PrimaryButton"
import { useColorScheme } from "react-native"

export function StepFour({
  dogDateOfBirth,
  setDogDateOfBirth,
}: {
  dogDateOfBirth: Date | null
  setDogDateOfBirth: (val: Date) => void
}) {
  const [showPicker, setShowPicker] = useState(false)
  const [tempDate, setTempDate] = useState(
    dogDateOfBirth != null && dogDateOfBirth instanceof Date ? dogDateOfBirth : new Date()
  )
  
  const colorScheme = useColorScheme() ?? 'light'

  return (
    <View items="center" justify="center">
      <YStack gap="$2" items="center">
        <BodyText>Step 4: Date of birth</BodyText>
        <Input
          placeholder="Date of Birth"
          value={dogDateOfBirth ? new Date(dogDateOfBirth).toLocaleDateString() : ''}
          editable={false}
          onPressIn={() => setShowPicker(true)}
        />

        <CustomSheet open={showPicker} setOpen={setShowPicker}>
          {(setShowPicker) => (
            <>
              <DateTimePicker
                value={tempDate}
                mode="date"
                maximumDate={new Date()}
                onChange={(e, selectedDate) => {
                  if (selectedDate) setTempDate(selectedDate)
                }}
                display="inline"
                themeVariant={colorScheme}
              />
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
      </YStack>
    </View>
  )
}