import { supabase } from "src/services/supabase/supabaseClient"

export async function signUpWithEmail(
  email: string,
  password: string,
  setLoading: (loading: boolean) => void
) {

  try {
    setLoading(true)
    const {
      data: { user, session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) throw error;
    

  } 
  
  catch(e) {
    throw e;
  } 
  
  finally {
    setLoading(false)
  }
}