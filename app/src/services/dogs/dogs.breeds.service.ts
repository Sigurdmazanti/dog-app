import { supabase } from "../supabase/supabaseClient"
import { DogBreed, mapDogBreedRowToDogBreed } from "./dogs.breeds.models"

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

export async function getDogBreeds(
  page: number,
  pageSize: number,
  search?: string
): Promise<{ breeds: DogBreed[]; total: number }> {
  const safePage = Math.max(1, page)
  const safePageSize = Math.min(Math.max(pageSize, 1), 50)

  const from = (safePage - 1) * safePageSize
  const to = from + safePageSize - 1

  let query = supabase
    .from("dog_breeds")
    .select("id, dog_breed", { count: "exact" })

  if (search?.trim()) 
    query = query.ilike("dog_breed", `%${search}%`)

  query = query.range(from, to)

  const { data, error, count } = await query
  if (error) throw error

  return { breeds: mapDogBreedRowToDogBreed(data), total: count ?? 0 }
}