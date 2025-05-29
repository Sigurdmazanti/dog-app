import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AddDogFormState {
  dogName: string
  dogBreed: string
  dogGender: string
  dogDateOfBirth: Date | null
  dogWeight: number
  dogHeight: number
  currentStep: number
}

const initialState: AddDogFormState = {
  dogName: '',
  dogBreed: '',
  dogGender: '',
  dogDateOfBirth: null,
  dogWeight: 0,
  dogHeight: 0,
  currentStep: 1,
}

export const formSlice = createSlice({
  name: 'dogForm',
  initialState,
  reducers: {
    updateField: <K extends keyof AddDogFormState>(
      state: AddDogFormState,
      action: PayloadAction<{ field: K; value: AddDogFormState[K] }>
    ) => {
      state[action.payload.field] = action.payload.value
    },
    goToStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
  },
})

export const { updateField, goToStep } = formSlice.actions

export default formSlice.reducer
