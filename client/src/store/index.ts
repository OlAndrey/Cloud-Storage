import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import fileReducer from './reducers/fileSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    drive: fileReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store