import { useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { Button, XStack } from 'tamagui'
import { PrimaryButton } from 'src/styled/button/PrimaryButton'
import { ContentContainer } from 'src/styled/container/ContentContainer'
import { FormStep, DogFormValues } from './AddDog.types'
import { StepOne, StepTwo, StepThree, StepFour, StepFive, Summary } from './steps'
import { DogBreed } from 'src/services/dogs/dogs.breeds.models'
import { DogBreedType } from 'src/services/dogs/dogs.models'

export const getSteps = (formValues: DogFormValues): FormStep[] => {
  return [
    {
      content: <StepOne />,
      canProceed: () => !!formValues.dogBreedType,
    },
    {
      content: <StepTwo />,
      canProceed: () => Array.isArray(formValues.dogBreed) && formValues.dogBreed.length > 0,
    },
    {
      content: <StepThree />,
      canProceed: () => !!formValues.dogName,
    },
    {
      content: <StepFour />,
      canProceed: () => !!formValues.dogDateOfBirth,
    },
    {
      content: <StepFive />,
      canProceed: () => !!formValues.dogAvatar,
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
      dogName: '',
      dogDateOfBirth: new Date(),
      dogBreedType: null,
      dogBreed: [],
      dogGender: null,
      isNeutered: false,
      dogHeightCm: 0,
      dogWeightKg: 0,
      dogTargetWeightKg: 0,
      dogActivityLevel: null,
      dogAvatar: ''
    },
  })

  const formValues = useWatch<DogFormValues>({
    control: methods.control,
  }) as DogFormValues;

  const steps = getSteps(formValues)
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