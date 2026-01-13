import { supabase } from "../supabase/supabaseClient"
import type { AuthError, Session, User } from "@supabase/supabase-js"

type SignInResponse = {
  user: User | null
  session: Session | null
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<SignInResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export async function signUpWithEmail(
  email: string,
  password: string
): Promise<SignInResponse> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export const getCurrentUser = async () : Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user ?? null
}

export const isSignedIn = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return !!user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error signing out:", error.message);
};