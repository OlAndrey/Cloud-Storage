import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import driveReducer from './reducers/driveSlice'
import uploadReducer from './reducers/uploadSlice'
import filesReducer from './reducers/filesSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    drive: driveReducer,
    upload: uploadReducer,
    files: filesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store