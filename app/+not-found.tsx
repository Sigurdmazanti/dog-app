import { Link, Stack } from 'expo-router'
import { StyleSheet } from 'react-native'
import { BodyText } from 'src/styled/text/BodyText'
import { View } from 'tamagui'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View m={10}>
        <BodyText>This screen doesn't exist.</BodyText>
        <Link href="/">
          <BodyText>Go to home screen!</BodyText>
        </Link>
      </View>
    </>
  )
}