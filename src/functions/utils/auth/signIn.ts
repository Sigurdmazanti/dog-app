import { supabase } from "src/services/supabase/supabaseClient"
import type { AuthError, Session, User } from "@supabase/supabase-js"

type SignInResponse = {
  user: User | null
  session: Session | null
  error: AuthError | null
}

export async function signInWithEmail(
  email: string,
  password: string,
  setLoading: (loading: boolean) => void
): Promise<SignInResponse> {
  setLoading(true)
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { ...data, error } // data has { user, session }
  } catch (err: any) {
    return { user: null, session: null, error: err }
  } finally {
    setLoading(false)
  }
}
