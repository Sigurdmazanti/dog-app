import { Text, View, Button, Input } from "tamagui"
import { useForm, Controller } from "react-hook-form"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useState, useMemo } from "react"

import type { FontSizeTokens, SelectProps } from 'tamagui'
import { Adapt, Label, Select, Sheet, XStack, YStack, getFontSize } from 'tamagui'
import { LinearGradient } from "tamagui/linear-gradient"


export default function SignUpForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: null,
    },
  })
  const onSubmit = (data: any) => console.log(data)
  const [showPicker, setShowPicker] = useState(false)
  const [tempDate, setTempDate] = useState(new Date())

  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: true
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Fornavn"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="default"
          />
        )}
        name="firstName"
      />
      {errors.firstName && <Text>This is required.</Text>}


      <Controller
        control={control}
        rules={{
          required: true
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Efternavn"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="lastName"
      />

      <Controller
        name="dateOfBirth"
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <>
            <Input
              placeholder="Fødselsdato"
              editable={false}
              onPressIn={() => setShowPicker(true)}
              value={value ? new Date(value).toLocaleDateString() : ""}
            />

            {showPicker && (
              <View>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) setTempDate(selectedDate)
                  }}
                />
                <Button onPress={() => {
                  onChange(tempDate)
                  setShowPicker(false)
                }}>
                  Confirm Date
                </Button>
                <Button onPress={() => setShowPicker(false)} 
                // color="$red10"
                >
                  Cancel
                </Button>
              </View>
            )}
          </>
        )}
      />
      {errors.dateOfBirth && <Text color="red">Date of Birth is required</Text>}


      <Button onPress={handleSubmit(onSubmit)}>
        Submit now
      </Button>
    </View>

  )
}