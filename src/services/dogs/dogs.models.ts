import { DogFormValues } from "src/components/forms/add-dog/AddDog.types"

/* =======================
   ENUMS (DB-aligned)
   ======================= */
export type DogBreedType = "mixed" | "pure";
export type DogGender = "male" | "female";
export type DogActivityLevel =
  | "very_inactive"
  | "inactive"
  | "moderately_active"
  | "active"
  | "very_active";

/* =======================
  APP MODEL (domain)
  ======================= */
export type Dog = {
  id: string
  ownerId: string
  name: string
  dateOfBirth: Date
  breedType: DogBreedType
  gender: DogGender
  isNeutered: boolean
  heightCm: number
  weightKg: number
  targetWeightKg: number
  activityLevel: DogActivityLevel
  avatarUrl: string | null
  createdAt: Date
}

/* =======================
   DB ROW MODEL
   ======================= */
export type DogRow = {
  id: string
  owner_id: string
  dog_name: string
  dog_date_of_birth: string
  dog_breed_type: DogBreedType
  dog_gender: DogGender
  dog_is_neutered: boolean
  dog_height_cm: number
  dog_weight_kg: number
  dog_target_weight_kg: number
  dog_activity_level: DogActivityLevel
  dog_avatar_url: string | null
  created_at: string
}

/* =======================
   INSERT MODEL
   ======================= */
export type DogInsert = Omit<DogRow, "id" | "created_at" | "dog_date_of_birth"> & {
  dog_date_of_birth: Date
}

/* =======================
   MAPPERS
   ======================= */
export function mapDogRowToDog(row: DogRow): Dog {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.dog_name,
    dateOfBirth: new Date(row.dog_date_of_birth),
    breedType: row.dog_breed_type,
    gender: row.dog_gender,
    isNeutered: row.dog_is_neutered,
    heightCm: row.dog_height_cm,
    weightKg: row.dog_weight_kg,
    targetWeightKg: row.dog_target_weight_kg,
    activityLevel: row.dog_activity_level,
    avatarUrl: row.dog_avatar_url,
    createdAt: new Date(row.created_at),
  }
}

export function mapDogFormToInsert(
  ownerId: string,
  form: DogFormValues
): DogInsert {
  if (!form.dogBreedType) throw new Error("Dog breed type must be selected")
  if (!form.dogGender) throw new Error("Dog gender must be selected")
  if (!form.dogActivityLevel) throw new Error("Dog activity level must be selected")
    
  return {
    owner_id: ownerId,
    dog_name: form.dogName,
    dog_date_of_birth: form.dogDateOfBirth,
    dog_breed_type: form.dogBreedType,
    dog_gender: form.dogGender,
    dog_is_neutered: form.isNeutered,
    dog_height_cm: form.dogHeightCm,
    dog_weight_kg: form.dogWeightKg,
    dog_target_weight_kg: form.dogTargetWeightKg,
    dog_activity_level: form.dogActivityLevel,
    dog_avatar_url: form.dogAvatar ?? null,
  }
}