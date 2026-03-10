import { JSX } from "react";
import { DogBreed } from "src/services/dogs/dogs.breeds.models";
import { DogActivityLevel, DogBreedType, DogGender } from "src/services/dogs/dogs.models";

export type FetchDogBreeds = (
  query: string,
  page: number,
  pageSize: number
) => Promise<DogBreed[]>

export type DogFormValues = {
  dogName: string
  dogDateOfBirth: Date
  dogBreedType: DogBreedType | null
  dogBreed: DogBreed[]
  dogGender: DogGender | null
  dogIsNeutered: boolean
  dogWeightKg?: number
  dogTargetWeightKg?: number
  dogActivityLevel: DogActivityLevel | null
  dogAvatar: string | null
}

export type FormStep = {
  content: JSX.Element,
  canProceed: () => boolean
}