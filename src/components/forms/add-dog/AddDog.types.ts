import { JSX } from "react";

export type DogBreedType = "mixed" | "pure" | "";
export type FetchItems = (query: string, page: number, pageSize: number) => Promise<string[]>

export type FormValues = {
  dogBreedType: DogBreedType;
  dogBreed: string[]
  dogName: string
  dogDateOfBirth: Date | null
}

export type FormStep = {
  content: JSX.Element,
  canProceed: () => boolean
}