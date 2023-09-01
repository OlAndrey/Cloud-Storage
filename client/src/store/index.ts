import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import fileReducer from './reducers/fileSlice'
import uploadReducer from './reducers/uploadSlice'
import trashReducer from './reducers/trashSlice'
import recentReducer from './reducers/recentSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    drive: fileReducer,
    upload: uploadReducer,
    trash: trashReducer,
    recent: recentReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store