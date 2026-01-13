import { DogFormValues } from "src/components/forms/add-dog/AddDog.types"

// Model for app
export type Dog = {
  id: string
  ownerId: string
  name: string
  dateOfBirth: string
  breedType: string
  avatarUrl: string | null
}

// Model for singular dog returned by DB
export type DogRow = {
  id: string
  owner_id: string
  dog_name: string
  dog_date_of_birth: string
  dog_breed_type: string
  dog_avatar_url: string | null
}

// Model data to be inserted into DB
export type DogInsert = {
  owner_id: string
  dog_name: string
  dog_date_of_birth: Date
  dog_breed_type: string
  dog_avatar_url: string | null
}

export function mapDogRowToDog(row: DogRow): Dog {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.dog_name,
    dateOfBirth: row.dog_date_of_birth,
    breedType: row.dog_breed_type,
    avatarUrl: row.dog_avatar_url
  }
}

export function mapDogFormToInsert(
  ownerId: string,
  form: DogFormValues
): DogInsert {
  return {
    owner_id: ownerId,
    dog_name: form.dogName,
    dog_date_of_birth: new Date(),
    dog_breed_type: form.dogBreedType,
    dog_avatar_url: form.dogAvatar
  }
}