import { useState } from 'react'
import { YStack } from 'tamagui'
import { GoogleIcon } from 'src/assets/icons/Google'
import { AppleIcon } from 'src/assets/icons/Apple'
import { EnvelopeIcon } from 'src/assets/icons/Envelope'
import { TertiaryButton } from 'src/styled/button/TertiaryButton'
import { useColorScheme } from 'react-native'
import { useRouter } from 'expo-router'
import { useFormContext } from 'react-hook-form'
import { DogFormValues } from 'src/components/forms/add-dog/AddDog.types'

export function SignUpOptions() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const colorScheme = useColorScheme();
  const router = useRouter();

  const { getValues } = useFormContext<DogFormValues>()
  const formValues = getValues()
  const serialized = JSON.stringify({
    ...formValues,
    dogDateOfBirth: formValues.dogDateOfBirth?.toISOString() ?? null
  });

  // TODO SET REDUX THEME ?
  const iconColor = colorScheme == "dark" ? "#000" : "#fff";
  return (
    <YStack gap="$2">
      <TertiaryButton 
        height={50} 
        icon={<EnvelopeIcon size={30} color="$primaryTextAccent" strokeWidth={1.5} />}
        onPress={() => router.push({
          pathname: '/signup/email',
          params: { data: serialized }
        })}
      >
        Continue using Email
      </TertiaryButton>

      <TertiaryButton
        height={50}
        icon={<GoogleIcon size={30} color="$primaryTextAccent" />}
      >
        Continue using Google (N/A)
      </TertiaryButton>

      <TertiaryButton 
        height={50} 
        icon={<AppleIcon size={30} color="$primaryTextAccent" />}
      >
        Continue using Apple (N/A)
      </TertiaryButton>
    </YStack>
      /* <View>
        <BodyText>email</BodyText>
        <Input
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View>
        <BodyText>password</BodyText>
        <Input
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View>
        <Button disabled={loading} onPress={() => signInWithEmail(email, password, setLoading)}>Sign in </Button>
      </View>
      <View>
        <Button disabled={loading} onPress={() => signUpWithEmail()}>Sign up </Button>
      </View> */
  )
}