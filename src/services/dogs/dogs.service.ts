import { DogFormValues } from "src/components/forms/add-dog/AddDog.types"
import { supabase } from "../supabase/supabaseClient"
import { Dog, DogRow, mapDogFormToInsert, mapDogRowToDog } from "./dogs.models"

export async function createDog(
  ownerId: string,
  formData: DogFormValues
): Promise<Dog> {
	const dataToInsert = mapDogFormToInsert(ownerId, formData);

  const { data, error } = await supabase
    .from("dogs")
    .insert(dataToInsert)
    .select()
    .single<DogRow>()

  if (error) throw error
  return mapDogRowToDog(data);
}

export async function getDog(
  dogId: string
): Promise<Dog> {
	const { data, error } = await supabase
		.from("dogs")
		.select("*")
		.eq("id", dogId)
		.single<DogRow>()

  if (error) throw error
  return mapDogRowToDog(data)
}

/*
export async function updateDog(
  dogId: string,
  updates: DogUpdate
): Promise<Dog> {
  const { data, error } = await supabase
    .from("dogs")
    .update(updates)
    .eq("id", dogId)
    .select()
    .single<DogRow>()

  if (error) throw error
  return mapDogRowToDog(data)
}
*/