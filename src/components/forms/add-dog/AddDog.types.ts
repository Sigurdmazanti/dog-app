import { JSX } from "react";
import { DogBreed, DogBreedType } from "src/services/dogs/dogs.breeds.models";

export type FetchDogBreeds = (
  query: string,
  page: number,
  pageSize: number
) => Promise<DogBreed[]>

export type DogFormValues = {
  dogBreedType: DogBreedType;
  dogBreed: DogBreed[]
  dogName: string
  dogDateOfBirth: Date
  dogAvatar: string | null
}

export type FormStep = {
  content: JSX.Element,
  canProceed: () => boolean
}