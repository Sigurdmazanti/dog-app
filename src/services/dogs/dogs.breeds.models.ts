export type DogBreedType = "mixed" | "pure" | "unknown";

export type DogBreed = {
  id: string;
  label: string;
}

export type DogBreedLinkInsert = {
  dog_id: string
  dog_breed_id: string
}