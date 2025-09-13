// store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import addDogFormReducer from './slices/addDogFormSlice'

const store = configureStore({
  reducer: {
    dogForm: addDogFormReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;