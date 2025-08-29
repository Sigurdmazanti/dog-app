import { useColorScheme } from 'react-native'
import { TamaguiProvider, type TamaguiProviderProps, Theme } from 'tamagui'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
import { CurrentToast } from './CurrentToast'
import { config } from 'tamagui.config'
import store from './store/store'
import { Provider } from 'react-redux'

type AppProps = {
  children: React.ReactNode
} & Omit<TamaguiProviderProps, 'config'>

export default function App({ children, ...rest }: AppProps) {
  const colorScheme = "light";//useColorScheme() ?? "light";

  return (
    <Provider store={store}>
      <TamaguiProvider
        config={config}
        defaultTheme={colorScheme}
        {...rest}
      >
        <Theme name={colorScheme}>
          <ToastProvider
            swipeDirection="horizontal"
            duration={6000}
            native={
              [
                // uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go
                // 'mobile'
              ]
            }
          >
            {children || null}
            <CurrentToast />
            {/* <ToastViewport top={0} left={0} right={0} /> */}
          </ToastProvider>
        </Theme>
      </TamaguiProvider>
    </Provider>
  )
}
