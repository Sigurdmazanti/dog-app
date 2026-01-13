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
