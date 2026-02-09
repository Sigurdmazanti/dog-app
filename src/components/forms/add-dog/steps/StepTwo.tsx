import { CustomSheet } from "src/components/sheet/CustomSheet"
import { SearchableSelectList } from "src/components/list/SearchableSelectList"
import { useState, useEffect } from "react"
import { PrimaryButton } from "src/styled/button/PrimaryButton"
import { YStack, View } from "tamagui"
import { DogFormValues, FetchDogBreeds } from "../AddDog.types"
import { supabase } from "src/services/supabase/supabaseClient"
import { BodyText } from "src/styled/text/BodyText"
import { DogBreed } from "src/services/dogs/dogs.breeds.models"
import { getDogBreeds } from "src/services/dogs/dogs.breeds.service"
import { DogBreedType } from "src/services/dogs/dogs.models"
import { useFormContext, useWatch } from "react-hook-form"

const fetchDogBreeds: FetchDogBreeds = async (search, page, pageSize) => {
  return await getDogBreeds(page, pageSize, search)
}

export function StepTwo() {
  const [open, setOpen] = useState(false)
  const { control, setValue, getValues } = useFormContext<DogFormValues>()

  const dogBreedType = useWatch<DogFormValues, "dogBreedType">({
    control,
    name: "dogBreedType",
  });

  const dogBreed = useWatch<DogFormValues, "dogBreed">({
    control,
    name: "dogBreed",
  });

  const handleSelectBreed = (item: DogBreed) => {
    const currentBreeds = getValues("dogBreed") || []

    if (!currentBreeds.some(b => b.id === item.id)) {
      if (dogBreedType !== "pure")
        setValue("dogBreed", [...currentBreeds, item])
      else
        setValue("dogBreed", [item])
    }

    setOpen(false)
  }
  
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
              {dogBreed.at(-1)?.label ?? 'Choose breed'}
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
            onSelect={handleSelectBreed}
          />
        )}
      </CustomSheet>
    </View>
  )
}
