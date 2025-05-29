import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import { goToStep, updateField } from '../../store/slices/addDogFormSlice'
import { View, Button, Input, Text, XStack, YStack } from 'tamagui'
import { CustomSheet } from './Sheet'
import { SearchableSelectList } from '../list/SearchableSelectList'

export default function MultiStepForm() {
  const dispatch = useDispatch<AppDispatch>()
  const currentStep = useSelector((state: RootState) => state.dogForm.currentStep)

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />
      case 2:
        return <StepTwo />
      // add more steps here
      case 3:
        return <Summary />
      default:
        return null
    }
  }

  return <View>{renderStep()}</View>
}

function StepOne() {
  const dispatch = useDispatch<AppDispatch>()
  const dogBreed = useSelector((state: RootState) => state.dogForm.dogBreed)
  const [open, setOpen] = useState(false)

  return (
      <View items="center" justify="center" height="100%">
        <YStack gap="$2">
          <Text>Step 1: Dog Breed</Text>
          <Button onPress={() => setOpen(true)}>Choose</Button>
        </YStack>

        <CustomSheet
          open={open}
          setOpen={setOpen}
        >
          {(setOpen) => (
            <SearchableSelectList
              setOpen={setOpen}
              pageSize={5}
              searchPlaceholder="Search..."
              loadMoreButtonText="Load more"
              title="Choose your dog's breed"
            />
          )}
        </CustomSheet>
      </View>
    )
}

function StepThree() {
  const dispatch = useDispatch<AppDispatch>()
  const dogName = useSelector((state: RootState) => state.dogForm.dogName)

  return (
    <View>
      <Text>Step 1: Dog Name</Text>
      <Input
        placeholder="What's the name of your dog?"
        value={dogName}
        onChangeText={(val) => dispatch(updateField({ field: 'dogName', value: val }))}
      />
      <Button onPress={() => dispatch(goToStep(2))}>Next</Button>
    </View>
  )
}

function StepTwo() {
  const dispatch = useDispatch<AppDispatch>()
  const dogDateOfBirth = useSelector((state: RootState) => state.dogForm.dogDateOfBirth)
  const [showPicker, setShowPicker] = useState(false)
  const [tempDate, setTempDate] = useState(dogDateOfBirth || new Date())

  return (
    <View>
      <Text>Step 2: Date of Birth</Text>
      <Input
        placeholder="Date of Birth"
        value={dogDateOfBirth ? new Date(dogDateOfBirth).toLocaleDateString() : ''}
        editable={false}
        onPressIn={() => setShowPicker(true)}
      />
      {showPicker && (
        <>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              if (selectedDate) setTempDate(selectedDate)
            }}
          />
          <Button
            onPress={() => {
              dispatch(updateField({ field: 'dogDateOfBirth', value: tempDate }))
              setShowPicker(false)
            }}
          >
            Confirm
          </Button>
          <Button onPress={() => setShowPicker(false)} color="$red10">
            Cancel
          </Button>
        </>
      )}

      <Button onPress={() => dispatch(goToStep(1))}>Back</Button>
      <Button onPress={() => dispatch(goToStep(3))}>Next</Button>
    </View>
  )
}

function Summary() {
  const form = useSelector((state: RootState) => state.dogForm)
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit = () => {
    // submit your form here, e.g. call API with form data
    console.log(form)
  }

  return (
    <View>
      <Text>Summary:</Text>
      <Text>Name: {form.dogName}</Text>
      <Text>Date of Birth: {form.dogDateOfBirth?.toLocaleDateString()}</Text>

      <Button onPress={() => dispatch(goToStep(2))}>Back</Button>
      <Button onPress={onSubmit}>Submit</Button>
    </View>
  )
}
