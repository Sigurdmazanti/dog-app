import { Link, Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'
import { GoogleIcon } from 'src/assets/icons/Google'
import { useAuth } from 'src/AuthProvider'

export default function TabLayout() {
  // const theme = useTheme()
  const { user, isLoading } = useAuth()

  return (
    <Tabs
      // screenOptions={{
      //   tabBarActiveTintColor: theme.red10.val,
      //   tabBarStyle: {
      //     backgroundColor: theme.background.val,
      //     borderTopColor: theme.borderColor.val,
      //   },
      //   headerStyle: {
      //     backgroundColor: theme.background.val,
      //     borderBottomColor: theme.borderColor.val,
      //   },
      //   headerTintColor: theme.color.val,
      // }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <GoogleIcon color="$danger"/>,
          headerRight: () => (
            <Link href="/modal" asChild>
              {/* <Button mr="$4" bg="$green8" color="$green12">
                Hello!
              </Button> */}
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: !user ? 'Log in' : 'Profile',
          tabBarIcon: ({ color }) => <GoogleIcon color="$danger"/>,
        }}
      />
      <Tabs.Screen
        name="add-dog"
        options={{
          title: 'Add dog :)',
        }}
      />
      
    </Tabs>
  )
}
