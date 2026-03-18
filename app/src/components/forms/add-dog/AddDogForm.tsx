import { useState } from 'react'
import { useForm, FormProvider, useWatch } from 'react-hook-form'
import { Button, View, XStack } from 'tamagui'
import { PrimaryButton } from 'src/styled/button/PrimaryButton'
import { ContentContainer } from 'src/styled/container/ContentContainer'
import { FormStep, DogFormValues } from './AddDog.types'
import { StepOne, StepTwo, StepThree, StepFour, StepFive, Summary } from './steps'
import { FormProgressBar } from './FormProgressBar'
import { ChevronRightIcon } from 'src/assets/icons/ChevronRight'
import { BodyText } from 'src/styled/text/BodyText'
import { ChevronLeftIcon } from 'src/assets/icons/ChevronLeft'
import { useAuth } from 'src/AuthProvider'
import { createDog } from 'src/services/dogs/dogs.service'

export const getSteps = (formValues: DogFormValues): FormStep[] => {
  return [
    {
      content: <StepOne />,
      canProceed: () => !!formValues.dogName
    },
    {
      content: <StepTwo />,
      canProceed: () => !!formValues.dogGender && !!formValues.dogDateOfBirth && typeof formValues.dogIsNeutered === 'boolean',
    },
    {
      content: <StepThree />,
      canProceed: () => !!formValues.dogBreedType && Array.isArray(formValues.dogBreed) && formValues.dogBreed.length > 0 && formValues.dogBreed.length < 3
    },
    {
      content: <StepFour />,
      canProceed: () => !!formValues.dogActivityLevel && !!formValues.dogWeightKg && !!formValues.dogTargetWeightKg,
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
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const methods = useForm<DogFormValues>({
    defaultValues: {
      dogName: undefined,
      dogDateOfBirth: undefined,
      dogBreedType: undefined,
      dogBreed: [],
      dogGender: undefined,
      dogIsNeutered: undefined,
      dogWeightKg: undefined,
      dogTargetWeightKg: undefined,
      dogActivityLevel: undefined,
      dogAvatar: undefined
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
      <ContentContainer flex={1}>
        <View flex={1} flexDirection="column" justify="space-between" height="100%">
          <View>
            <FormProgressBar currentStep={currentStep} totalSteps={maxStep} />
            {currentStepData.content}
          </View>
          <XStack mt="$4" px="$8" gap="$8" items="center">
            <PrimaryButton
              onPress={() => {
                if (isBackButtonEnabled) {
                  goBack()
                }
              }}
              tone={isBackButtonEnabled ? "inactive" : "disabled"}
            >
              <XStack items="center" justify="center" gap='$1' ml='$-2'>
                <ChevronLeftIcon size="$1" mt={1} color={isBackButtonEnabled ? "$primaryText" : "$disabledText"} />
                <BodyText tone={isBackButtonEnabled ? "inactive" : "disabled"}>Back</BodyText>
              </XStack>
            </PrimaryButton>
            
            <View flex={1} />
            
            {!isLastStep && (
              <PrimaryButton
                onPress={() => {
                  if (canProceed)
                    goNext()
                }}
                tone={canProceed ? "success" : "disabled"}
              >
                <XStack items="center" justify="center" gap='$1' mr='$-2'>
                  <BodyText tone={canProceed ? "default" : "disabled"}>Next</BodyText>
                  <ChevronRightIcon size="$1" mt={1} color={canProceed ? "$primaryText" : "$disabledText"} />
                </XStack>
              </PrimaryButton>
            )}
            {isLastStep && (
              <Button onPress={methods.handleSubmit((data) => createDog(user!.id, data))}>
                Submit
              </Button>
            )}
          </XStack>
        </View>
      </ContentContainer>
    </FormProvider>
  )
}