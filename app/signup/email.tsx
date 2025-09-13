import { useState } from 'react'
import { YStack, Input, Button, View } from 'tamagui'
import { useRouter } from 'expo-router'
import { BodyText } from 'src/styled/text/BodyText'
import { signUpWithEmail } from 'src/functions/utils/auth/signUp'

export default function EmailSignup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async () => {
    try {
      await signUpWithEmail(email, password, setLoading)
      // navigate to home or next step after successful signup
      router.push('/') // adjust this to your post-signup route
    } catch (e) {
      console.log('Signup failed', e)
    }
  }

  return (
    <YStack gap="$3" p="$4">
      <BodyText>Email</BodyText>
      <Input
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
      />

      <BodyText>Password</BodyText>
      <Input
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
      />
    </YStack>
  )

}