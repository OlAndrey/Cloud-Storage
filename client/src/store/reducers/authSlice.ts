/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginUser } from '../actions/authActions'
import { IRegisterUserValue, IUserInfo } from '../../types/auth'
import axios from '../../utils/axios'

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

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: IRegisterUserValue, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        '/api/auth/registration',
        { name, email, password }
      )

      window.localStorage.setItem('userToken', res.data.token)
      return res.data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { user, token } = action.payload
        state.loading = false
        state.userInfo = user
        state.userToken = token
      })
      .addCase(registerUser.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''
        state.loading = false
        state.error = errorMsg as string
      })

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, token } = action.payload

        state.loading = false
        state.userInfo = user
        state.userToken = token
      })
      .addCase(loginUser.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''
        state.loading = false
        state.error = errorMsg as string
      })
  },
})

export const { resetError } = authSlice.actions

export default authSlice.reducer
