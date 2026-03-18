import { View } from "tamagui"
import { SignUpOptions } from "src/components/auth/signup/SignUpOptions"
import { CustomH3 } from "src/styled/headings/CustomH3"

export function Summary() {

  return (
    <View>
      {/* <BodyText>Summary:</BodyText>
      <BodyText>Breed: {form.dogBreed.length > 1 ? form.dogBreed.join(', ') : form.dogBreed}</BodyText>
      <BodyText>Name: {form.dogName}</BodyText>
      <BodyText>Date of Birth: {form.dogDateOfBirth?.toLocaleDateString()}</BodyText> */}
      <CustomH3 text="center" mb="$4">Let's get started</CustomH3>
      <SignUpOptions />
    </View>
  )
}