import { supabase } from "services/supabase/supabaseClient"

export async function signInWithEmail(
  email: string,
  password: string,
  setLoading: (loading: boolean) => void
) {
  setLoading(true)
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  } finally {
    setLoading(false)
  }
}
