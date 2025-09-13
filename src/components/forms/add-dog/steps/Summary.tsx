import { View, Text } from "tamagui"
import { FormValues } from "../AddDog.types"
import { useFormContext } from "react-hook-form"
import { BodyText } from "src/styled/text/BodyText"
import { Login } from "src/components/auth/login/Login"
import { HeadingText } from "src/styled/text/HeadingText"

export function Summary() {
  const { getValues } = useFormContext<FormValues>()
  const form = getValues()

  return (
    <View>
      {/* <BodyText>Summary:</BodyText>
      <BodyText>Breed: {form.dogBreed.length > 1 ? form.dogBreed.join(', ') : form.dogBreed}</BodyText>
      <BodyText>Name: {form.dogName}</BodyText>
      <BodyText>Date of Birth: {form.dogDateOfBirth?.toLocaleDateString()}</BodyText> */}
      <HeadingText text="center" mb="$4">Let's get started</HeadingText>
      <Login />
    </View>
  )
}