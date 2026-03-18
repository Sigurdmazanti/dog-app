import { Text } from 'tamagui'
import { useAuth } from 'src/AuthProvider'
import ProfileLogin from './sign-in'

export default function ProfileIndex() {
  const { user } = useAuth()

  if (!user) {
    return <ProfileLogin />
  }

  return <Text>Welcome, {user.email}</Text>
}
