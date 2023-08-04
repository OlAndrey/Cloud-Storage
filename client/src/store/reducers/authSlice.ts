import { createSlice } from '@reduxjs/toolkit'
import { IUserInfo } from '../../types/auth'

interface AuthState {
  loading: boolean
  userInfo: IUserInfo | null
  userToken: string | null
  error: string | null
}

const initialState: AuthState = {
  loading: false,
  userInfo: null,
  userToken: null,
  error: 'Error',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {},
})

export default authSlice.reducer
