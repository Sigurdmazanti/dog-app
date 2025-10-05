import { AuthResponse } from "@supabase/supabase-js"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "src/services/supabase/supabaseClient"

type SignUpResponse = {
  user: User | null
  session: Session | null
}

export async function signUpWithEmail(
  email: string,
  password: string,
  setLoading: (loading: boolean) => void
): Promise<SignUpResponse | null> {
  try {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      console.error("Supabase error:", error)
      console.log("Status:", (error as any).status)
      console.log("Message:", error.message)
      throw error
    }

    return data
    
  } catch (e: any) {
    console.log("Caught error:", e)
    return null
    
  } finally {
    setLoading(false)
  }
}
