import { useState } from 'react'
import { View, Input, Button, YStack, XStack } from 'tamagui'
import { BodyText } from 'src/styled/text/BodyText'
import { signUpWithEmail } from 'src/functions/utils/auth/signUp'
import { PrimaryButton } from 'src/styled/button/PrimaryButton'
import { ContentContainer } from 'src/styled/container/ContentContainer'
import { GoogleIcon } from 'src/assets/icons/Google'
import { AppleIcon } from 'src/assets/icons/Apple'
import { EnvelopeIcon } from 'src/assets/icons/Envelope'
import { TertiaryButton } from 'src/styled/button/TertiaryButton'
import { Keyboard, TouchableWithoutFeedback, useColorScheme } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { FloatingLabelInput } from 'src/components/input/FloatingLabelInput'
import { TextDividerWithLines } from 'src/components/text/TextDividerWithLines'
import { LinkText } from 'src/styled/text/LinkText'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const colorScheme = useColorScheme();
  const router = useRouter();

  // TODO SET REDUX THEME ?
  const iconColor = colorScheme == "dark" ? "#000" : "#fff";

  return (
    <YStack p="$4" flex={1}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack gap="$3" flex={1}>
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

          <XStack justify="flex-end">
            <Link href='./sign-up' asChild>
              <LinkText cursor="pointer" textDecorationLine="underline">
                Forgotten password? (N/A)
              </LinkText>
            </Link>
          </XStack>
    
          <PrimaryButton
            mt='$4'
            // onPress={() => signUpWithEmail(email, password, setLoading)}
          >
            Log in
          </PrimaryButton>

          <YStack py='$2'>
            <TextDividerWithLines text='OR'/>
          </YStack>

          <TertiaryButton
            height={50}
            icon={<GoogleIcon size={30} color="$primaryTextAccent" />}
          >
            Log in using Google (N/A)
          </TertiaryButton>

          <TertiaryButton 
            height={50} 
            icon={<AppleIcon size={30} color="$primaryTextAccent" />}
          >
            Log in using Apple (N/A)
          </TertiaryButton>

          <XStack
            items='center'
            justify='center'
            mt='$4'
          >
            <BodyText mr='$1'>
              Don't have an account?
            </BodyText>
            <Link href='../profile/sign-up' asChild>
              <LinkText cursor="pointer" textDecorationLine="underline">
                Sign up
              </LinkText>
            </Link>
          </XStack>
        </YStack>
      </TouchableWithoutFeedback>
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