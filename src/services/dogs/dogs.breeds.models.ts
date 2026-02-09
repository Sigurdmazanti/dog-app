export type DogBreed = {
  id: string
  label: string
}

// full
export type DogBreedRow = {
  id: string
  dog_breed: string
  dog_age_min: number
  dog_age_max: number
  created_at: string
  dog_category_id: string
  dog_species_id: string
}

export type DogBreedListRow = {
  id: string
  dog_breed: string
}

export function mapDogBreedRowToDogBreed(
  rows: DogBreedListRow[]
): DogBreed[] {
  return rows.map(row => ({
    id: row.id,
    label: row.dog_breed
  }))
}
