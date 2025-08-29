import { CustomSheet } from "components/sheet/CustomSheet"
import { SearchableSelectList } from "components/list/SearchableSelectList"
import { useState, useEffect } from "react"
import { PrimaryButton } from "styled/button/PrimaryButton"
import { YStack, View } from "tamagui"
import { FetchItems } from "../AddDog.types"
import { supabase } from "services/supabase/supabaseClient"
import { BodyText } from "styled/text/BodyText"

const fetchDogBreeds: FetchItems = async (search, page, pageSize) => {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let queryBuilder = supabase
    .from('dog_breeds')
    .select('dog_breed')
    .range(from, to)

  if (search.trim()) {
    queryBuilder = queryBuilder.ilike('dog_breed', `%${search}%`)
  }

  const { data, error } = await queryBuilder
  if (error) throw error
  return data.map((row: any) => row.dog_breed)
}

export function StepTwo({
  dogBreedType,
  dogBreed,
  setDogBreed,
}: {
  dogBreedType: string,
  dogBreed: string[]
  setDogBreed: (val: string[]) => void
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
                {breed}
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
          <SearchableSelectList
            setOpen={setOpen}
            pageSize={5}
            fetchItems={fetchDogBreeds}
            searchPlaceholder="Search..."
            loadMoreButtonText="Load more"
            noResultsText="No results found"
            title="Choose your dog's breed"
            onSelect={(value: string) => {
              if (!dogBreed.includes(value)) {
                if (dogBreedType !== 'pure') {
                  setDogBreed([...dogBreed, value])
                }
                else {
                  setDogBreed([value])
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
