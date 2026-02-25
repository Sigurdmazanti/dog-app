import { CustomSheet } from "src/components/sheet/CustomSheet"
import { SearchableSelectList } from "src/components/list/SearchableSelectList"
import { useState, useCallback } from "react"
import { PrimaryButton } from "src/styled/button/PrimaryButton"
import { YStack, XStack, View } from "tamagui"
import { RadioGroup } from "tamagui"
import { DogFormValues } from "../AddDog.types"
import { BodyText } from "src/styled/text/BodyText"
import { DogBreed } from "src/services/dogs/dogs.breeds.models"
import { getDogBreeds } from "src/services/dogs/dogs.breeds.service"
import { DogBreedType } from "src/services/dogs/dogs.models"
import { useFormContext, useWatch } from "react-hook-form"
import { RadioGroupItem } from "src/components/input/RadioGroupItem"
import { CustomInputLabel } from "src/styled/input/CustomInputLabel"
import { CloseIcon } from "src/assets/icons/Close"

const dogBreedTypeItems: { value: DogBreedType; label: string }[] = [
  { value: "pure", label: "Pure breed" },
  { value: "mixed", label: "Mixed breed" },
]

export function StepThree() {
  const [open, setOpen] = useState(false)
  const [shownCount, setShownCount] = useState(0);
  const [totalBreeds, setTotalBreeds] = useState(0);
  const { control, setValue, getValues } = useFormContext<DogFormValues>()
  const dogName = getValues()?.dogName;
  const fetchDogBreeds = useCallback(async (search: string, page: number, pageSize: number) => {
    const { breeds, total } = await getDogBreeds(page, pageSize, search)
    return { items: breeds, total }
  }, [])


  const dogBreedType = useWatch<DogFormValues, "dogBreedType">({
    control,
    name: "dogBreedType",
  })

  const dogBreed = useWatch<DogFormValues, "dogBreed">({
    control,
    name: "dogBreed",
  })


  const handleFetchResult = useCallback((shown: number, total: number) => {
    setShownCount(shown);
    setTotalBreeds(total);
  }, []);

  const handleSelectBreed = (item: DogBreed) => {
    const currentBreeds = getValues("dogBreed") || []

    if (!currentBreeds.some(b => b.id === item.id)) {
      if (dogBreedType === "mixed")
        setValue("dogBreed", [...currentBreeds, item])
      else
        setValue("dogBreed", [item])
    }

    setOpen(false)
  }

  const handleRemoveBreed = (index: number) => {
    const currentBreeds = getValues("dogBreed") || []
    setValue("dogBreed", currentBreeds.filter((_, i) => i !== index))
  }
  
  return (
    <View items="center" justify="center" gap="$6">
      <YStack gap="$2" maxW={300} width="100%">
        <CustomInputLabel>What type of breed is {dogName}?</CustomInputLabel>
        <RadioGroup
          items="center"
          gap="$2.5"
          orientation="vertical"
          value={dogBreedType ?? undefined}
          onValueChange={(val) => {
            setValue("dogBreedType", val as DogBreedType)
            setValue("dogBreed", []) // Reset breeds when type changes
          }}
        >
          {dogBreedTypeItems.map((item) => (
            <RadioGroupItem
              key={item.value}
              selected={dogBreedType === item.value}
              value={item.value}
              label={item.label}
              onSelect={() => {
                setValue("dogBreedType", item.value as DogBreedType)
                setValue("dogBreed", [])
              }}
            />
          ))}
        </RadioGroup>
      </YStack>

      {dogBreedType && (
        <YStack gap="$2" maxW={300} width="100%">
          <CustomInputLabel>Choose {dogBreedType === "mixed" ? "up to 2 breeds" : "a breed"}</CustomInputLabel>

          {dogBreedType === "mixed" && (
            <>
              {dogBreed?.map((breed, index) => (
                <PrimaryButton key={index} onPress={() => handleRemoveBreed(index)}>
                  <XStack items="center" justify="center" gap='$1.5'>
                    <BodyText>{breed.label}</BodyText>
                    <CloseIcon size="$1" />
                  </XStack>
                </PrimaryButton>
              ))}

              {(dogBreed?.length ?? 0) < 2 && (
                <PrimaryButton onPress={() => setOpen(true)}>
                  {dogBreed?.length === 0 ? "Choose breed" : "Add another breed"}
                </PrimaryButton>
              )}
            </>
          )}

          {dogBreedType === "pure" && (
            <PrimaryButton onPress={() => setOpen(true)}>
              {dogBreed?.at(-1)?.label ?? "Choose breed"}
            </PrimaryButton>
          )}
        </YStack>
      )}

      <CustomSheet open={open} setOpen={setOpen}>
        {(setOpen) => (
          <>
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
              showTotalCount={true}
              showTotalCountSuffix="breeds"
              onFetchResult={handleFetchResult}
            />
          </>
        )}
      </CustomSheet>
    </View>
  )
}
