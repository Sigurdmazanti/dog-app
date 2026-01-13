import { useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { Button, XStack } from 'tamagui'
import { PrimaryButton } from 'src/styled/button/PrimaryButton'
import { ContentContainer } from 'src/styled/container/ContentContainer'
import { FormStep, DogFormValues } from './AddDog.types'
import { StepOne, StepTwo, StepThree, StepFour, StepFive, Summary } from './steps'
import { DogBreed, DogBreedType } from 'src/services/dogs/dogs.breeds.models'

const getSteps = (methods: any): FormStep[] => {
  const dogBreedType = useWatch({ control: methods.control, name: 'dogBreedType' })
  const dogBreed = useWatch({ control: methods.control, name: 'dogBreed' })
  const dogName = useWatch({ control: methods.control, name: 'dogName' })
  const dogDateOfBirth = useWatch({ control: methods.control, name: 'dogDateOfBirth' })
  const dogAvatar = useWatch({ control: methods.control, name: 'dogAvatar' })

  return [
    {
      content: <StepOne dogBreedType={dogBreedType} setDogBreedType={(val: DogBreedType) => methods.setValue('dogBreedType', val)} />,
      canProceed: () => !!dogBreedType,
    },
    {
      content: <StepTwo dogBreedType={dogBreedType} dogBreed={dogBreed} setDogBreed={(val: DogBreed[]) => methods.setValue('dogBreed', val)} />,
      canProceed: () => Array.isArray(dogBreed) && dogBreed.length > 0,
    },
    {
      content: <StepThree dogName={dogName} setDogName={(val: string) => methods.setValue('dogName', val)} />,
      canProceed: () => !!dogName,
    },
    {
      content: <StepFour dogDateOfBirth={dogDateOfBirth} setDogDateOfBirth={(val: Date) => methods.setValue('dogDateOfBirth', val)} />,
      canProceed: () => !!dogDateOfBirth,
    },
    {
      content: <StepFive dogAvatar={dogAvatar} setDogAvatar={(val: string) => methods.setValue('dogAvatar', val)} />,
      canProceed: () => !!dogAvatar,
    },
    {
      content: <Summary />,
      canProceed: () => true,
    },
  ]
}

export default function AddDogForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const methods = useForm<DogFormValues>({
    defaultValues: {
      dogBreedType: 'unknown',
      dogBreed: [],
      dogName: '',
      dogDateOfBirth: new Date(),
      dogAvatar: ''
    },
  })

  const steps = getSteps(methods)
  const maxStep = steps.length
  const isLastStep = currentStep === maxStep
  const currentStepData = steps[currentStep - 1]
  const canProceed = currentStepData.canProceed()
  const isBackButtonEnabled = currentStep > 1

  const goNext = () => setCurrentStep(prev => Math.min(prev + 1, maxStep))
  const goBack = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <FormProvider {...methods}>
      <ContentContainer>
        {currentStepData.content}

        <XStack mt="$4" gap="$2" justify="center">
          <PrimaryButton
            onPress={() => {
              if (isBackButtonEnabled) {
                goBack()
              }
            }}
            tone={isBackButtonEnabled ? "success" : "disabled"}
          >
            Back
          </PrimaryButton>

          {!isLastStep && (
            <PrimaryButton
              onPress={() => {
                if (canProceed) {
                  goNext()
                }
              }}
              tone={canProceed ? "success" : "disabled"}
            >
              Next
            </PrimaryButton>
          )}

          {isLastStep && (
            <Button onPress={methods.handleSubmit((data) => console.log('Submit:', data))}>
              Submit
            </Button>
          )}
        </XStack>
      </ContentContainer>
    </FormProvider>
  )
}