import { Link, Stack } from 'expo-router'
import { StyleSheet } from 'react-native'
import { BodyText } from 'styled/text/BodyText'
import { View } from 'tamagui'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View m={10}>
        <BodyText>This screen doesn't exist.</BodyText>
        <Link href="/" style={styles.link}>
          <BodyText style={styles.linkText}>Go to home screen!</BodyText>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
})
