import { AppState, useColorScheme } from 'react-native'
import { TamaguiProvider, type TamaguiProviderProps, Theme } from 'tamagui'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
import { CurrentToast } from '../app/CurrentToast'
import { AuthProvider } from './AuthProvider'
import { config } from 'tamagui.config'
import store from './store/store'
import { Provider } from 'react-redux'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useEffect } from 'react'
import { supabase } from 'src/services/supabase/supabaseClient'

type AppProps = {
  children?: React.ReactNode
  colorScheme?: 'light' | 'dark'
} & Omit<TamaguiProviderProps, 'config'>

export default function App({ children, colorScheme = 'light', ...rest }: AppProps) {
  
  colorScheme = useColorScheme() ?? "light";

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh()
      } 
      
      else {
        supabase.auth.stopAutoRefresh()
      }
    })

    return () => subscription.remove()
  }, [])
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AuthProvider>
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
        </AuthProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}
