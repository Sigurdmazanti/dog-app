import { supabase } from "services/supabase/supabaseClient"

export async function signUpWithEmail(
  email: string,
  password: string,
  setLoading: (loading: boolean) => void
) {
  setLoading(true)
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  setLoading(false)
}