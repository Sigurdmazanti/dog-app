import { useState } from 'react'
import { View, Input, Button, YStack, XStack } from 'tamagui'
import { BodyText } from 'src/styled/text/BodyText'
import { signInWithEmail } from 'src/functions/utils/auth/signIn'
import { signUpWithEmail } from 'src/functions/utils/auth/signUp'
import { PrimaryButton } from 'src/styled/button/PrimaryButton'
import { ContentContainer } from 'src/styled/container/ContentContainer'
import { GoogleIcon } from 'src/assets/icons/Google'
import { AppleIcon } from 'src/assets/icons/Apple'
import { EnvelopeIcon } from 'src/assets/icons/Envelope'
import { TertiaryButton } from 'src/styled/button/TertiaryButton'
import { useColorScheme } from 'react-native'
import { useRouter } from 'expo-router'

export function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const colorScheme = useColorScheme();
  const router = useRouter();

  // TODO SET REDUX THEME ?
  const iconColor = colorScheme == "dark" ? "#000" : "#fff";

  return (
    <YStack gap="$2">
      <TertiaryButton 
        height={50} 
        icon={<EnvelopeIcon size={30} color="$primaryTextAccent" strokeWidth={1.5} />}
        onPress={() => router.push('/signup/email')}
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