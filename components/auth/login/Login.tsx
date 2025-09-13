import { useState } from 'react'
import { View, Input, Button, YStack } from 'tamagui'
import { BodyText } from 'styled/text/BodyText'
import { signInWithEmail } from 'app/functions/utils/auth/signIn'
import { signUpWithEmail } from 'app/functions/utils/auth/signUp'
import { PrimaryButton } from 'styled/button/PrimaryButton'
import { ContentContainer } from 'styled/container/ContentContainer'
import { GoogleIcon } from 'assets/icons/Google'
import { AppleIcon } from 'assets/icons/Apple'
import { EnvelopeIcon } from 'assets/icons/Envelope'
import { TertiaryButton } from 'styled/button/TertiaryButton'
import { useColorScheme } from 'react-native'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const colorScheme = useColorScheme();

  // TODO SET REDUX THEME ?
  const iconColor = colorScheme == "dark" ? "#000" : "#fff";

  return (
      <ContentContainer>
        <YStack>
          <TertiaryButton>
            <EnvelopeIcon size={26} color={iconColor} />
            Continue using Email
          </TertiaryButton>
          <TertiaryButton>
            <GoogleIcon size={26} color={iconColor} />
            Continue using Google
          </TertiaryButton>
          <TertiaryButton>
            <AppleIcon size={26} color={iconColor} />
            Continue using Apple
          </TertiaryButton>
        </YStack>
      </ContentContainer>
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