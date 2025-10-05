import { useState } from 'react'
import { YStack, Input, Button, View, XStack, Label, Text, getVariableValue } from 'tamagui'
import { Link, useRouter } from 'expo-router'
import { BodyText } from 'src/styled/text/BodyText'
import { signUpWithEmail } from 'src/functions/utils/auth/signUp'
import { ContentContainer } from 'src/styled/container/ContentContainer'
import { EnvelopeIcon } from 'src/assets/icons/Envelope'
import { CustomInput } from 'src/styled/input/Input'
import { HeadingText } from 'src/styled/text/HeadingText'
import { CustomLabel } from 'src/styled/input/Label'
import { FloatingLabelInput } from 'src/components/input/FloatingLabelInput'
import { Keyboard, TouchableWithoutFeedback, useColorScheme } from 'react-native'
import { PrimaryButton } from 'src/styled/button/PrimaryButton'
import { LinkText } from 'src/styled/text/LinkText'

export default function EmailSignup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // TODO: Validation using ZOD maybe?
  const handleSignUp = async () => {
    try {
      const data = await signUpWithEmail(email, password, setLoading)
      if (!data) return
      
      if (data.session) {
        // logged in right away (if email confirmation is OFF)
        router.replace('/profile')
      } else {
        // TODO: Email confirmation
        // router.replace('/check-email') 
      }
    } catch (e) {
      console.log('Signup failed', e)
    }
  }


  return (
    <ContentContainer>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack gap="$3" p="$4" flex={1}>
          <FloatingLabelInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCorrect={false}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />

          <FloatingLabelInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            hideValue={true}
            autoCapitalize="none"
            autoComplete="off"
            textContentType="none"
          />

          <PrimaryButton
            mt='$4'
            onPress={() => handleSignUp()}
          >
            Sign up
          </PrimaryButton>

        </YStack>
      </TouchableWithoutFeedback>
      <XStack>
        <Text>
          Already a user?
        </Text>
        <Link href='./sign-up' asChild>
          <LinkText cursor="pointer" textDecorationLine="underline">
          </LinkText>
        </Link>
      </XStack>
    </ContentContainer>
  )

}