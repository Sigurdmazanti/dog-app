import { supabase } from "../supabase/supabaseClient"

type BreedRef = { id: string }

export async function linkDogBreeds(
  dogId: string,
  breeds: BreedRef[]
): Promise<void> {
  if (!breeds.length) return

  const { error } = await supabase
    .from("dog_breed_links")
    .insert(
      breeds.map(breed => ({
        dog_id: dogId,
        dog_breed_id: breed.id
      }))
    )

  if (error) throw error
}