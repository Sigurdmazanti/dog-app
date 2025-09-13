import { Link, Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'
import { GoogleIcon } from 'src/assets/icons/Google'

export default function TabLayout() {
  // const theme = useTheme()

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
          tabBarIcon: ({ color }) => <GoogleIcon color={color}/>,
          headerRight: () => (
            <Link href="/modal" asChild>
              {/* <Button mr="$4" bg="$green8" color="$green12">
                Hello!
              </Button> */}
            </Link>
          ),
        }}
      />

    </Tabs>
  )
}
