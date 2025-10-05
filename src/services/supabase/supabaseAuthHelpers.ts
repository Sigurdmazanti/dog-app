import { supabase } from './supabaseClient'

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user ?? null
}

export const isSignedIn = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return !!user
}

export const onAuthChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error signing out:", error.message);
};