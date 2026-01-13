import { CustomSheet } from "src/components/sheet/CustomSheet"
import { SearchableSelectList } from "src/components/list/SearchableSelectList"
import { useState, useEffect } from "react"
import { PrimaryButton } from "src/styled/button/PrimaryButton"
import { YStack, View } from "tamagui"
import { DogBreed, FetchDogBreeds } from "../AddDog.types"
import { supabase } from "src/services/supabase/supabaseClient"
import { BodyText } from "src/styled/text/BodyText"

const fetchDogBreeds: FetchDogBreeds = async (search, page, pageSize) => {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let queryBuilder = supabase
    .from('dog_breeds')
    .select('id, dog_breed')
    .range(from, to)

  if (search.trim()) {
    queryBuilder = queryBuilder.ilike('dog_breed', `%${search}%`)
  }

  const { data, error } = await queryBuilder
  if (error) throw error

  return data.map(row => ({
    id: row.id,
    label: row.dog_breed,
  }))
}

export function StepTwo({
  dogBreedType,
  dogBreed,
  setDogBreed,
}: {
  dogBreedType: string,
  dogBreed: DogBreed[]
  setDogBreed: (val: DogBreed[]) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <View items="center" justify="center">
      <YStack gap="$2" items="center">
        <BodyText>Step 2: Dog Breed</BodyText>
        
        {dogBreedType === 'mixed' && (
          <>
            {dogBreed.map((breed, index) => (
              <PrimaryButton key={index} onPress={() => setOpen(true)}>
                {breed.label}
              </PrimaryButton>
            ))}

            {dogBreed.length < 3 && (
              <PrimaryButton onPress={() => setOpen(true)}>
                {dogBreed.length === 0 ? "Choose breed" : "Add another breed"}
              </PrimaryButton>
            )}
          </>
        )}

        {dogBreedType === 'pure' && (
          <>
            <PrimaryButton onPress={() => setOpen(true)}>
              {dogBreed.at(-1) || 'Choose breed'}
            </PrimaryButton>
          </>
        )}

      </YStack>

      <CustomSheet open={open} setOpen={setOpen}>
        {(setOpen) => (
          <SearchableSelectList<DogBreed>
            setOpen={setOpen}
            pageSize={5}
            fetchItems={fetchDogBreeds}
            searchPlaceholder="Search..."
            loadMoreButtonText="Load more"
            noResultsText="No results found"
            title="Choose your dog's breed"
            getKey={dog => dog.id}
            getLabel={dog => dog.label}
            onSelect={(item: DogBreed) => {
              if (!dogBreed.some(b => b.id === item.id)) {
                if (dogBreedType !== 'pure') {
                  setDogBreed([...dogBreed, item])
                } else {
                  setDogBreed([item])
                }
              }
              setOpen(false)
            }}
          />
        )}
      </CustomSheet>
    </View>
  )
}
