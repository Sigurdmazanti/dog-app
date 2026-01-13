import { supabase } from './supabaseClient'

export const getSession = () => supabase.auth.getSession()

export const onAuthChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}
