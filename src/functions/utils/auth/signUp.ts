import { AuthResponse } from "@supabase/supabase-js"
import type { User, Session } from "@supabase/supabase-js"
import { DogFormValues } from "src/components/forms/add-dog/AddDog.types"
import { supabase } from "src/services/supabase/supabaseClient"

type SignUpResponse = {
  user: User | null
  session: Session | null
}

export async function signUpWithEmail(
  formData: DogFormValues,
  email: string,
  password: string,
  setLoading: (loading: boolean) => void
): Promise<SignUpResponse | null> {
  try {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) throw error

    const user = data.user
    if (!user) return data

    const dogPayload = {
      owner_id: user.id,
      dog_name: formData.dogName,
      dog_date_of_birth: formData.dogDateOfBirth,
      dog_breed_type: formData.dogBreedType,
      dog_avatar_url: formData.dogAvatar
    }

    const { data: dogData, error: dogError } = await supabase
      .from("dogs")
      .insert(dogPayload)
      .select()
      .single()

    if (dogError) throw dogError

    const dogBreeds = formData.dogBreed ?? []

    if (dogBreeds.length > 0) {
      const { data: linkData, error: linkError } = await supabase
        .from("dog_breed_links")
        .insert(
          dogBreeds.map(breed => ({
            dog_id: dogData.id,
            dog_breed_id: breed.id
          }))
        )
        
      if (linkError) throw linkError
    }

    return data
    
  } catch (e: any) {
    console.log("Caught error:", e)
    return null
    
  } finally {
    setLoading(false)
  }
}
