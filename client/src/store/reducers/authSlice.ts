/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ILoginUserValue, IRegisterUserValue, IUserInfo } from '../../types/auth'
import axios from '../../utils/axios'

interface AuthState {
  loading: boolean
  authCheck: boolean
  userInfo: IUserInfo | null
  userToken: string | null
  error: string | null
}

const initialState: AuthState = {
  loading: false,
  authCheck: false,
  userInfo: null,
  userToken: null,
  error: 'Error',
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: IRegisterUserValue, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/auth/registration', { name, email, password })

      window.localStorage.setItem('userToken', res.data.token)
      return res.data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: ILoginUserValue, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password })

      window.localStorage.setItem('userToken', res.data.token)
      return res.data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

export const authCheckThunk = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/auth/me')

    window.localStorage.setItem('userToken', res.data.token)
    return res.data
  } catch (error: any) {
    if (error.response && error.response.data.message) {
      return rejectWithValue(error.response.data.message)
    } else {
      return rejectWithValue(error.message)
    }
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null
    },
    authChecked: (state) => {
      state.authCheck = true
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

    builder
      .addCase(authCheckThunk.pending, () => undefined)
      .addCase(authCheckThunk.fulfilled, (state, action) => {
        const { user, token } = action.payload

        state.authCheck = true
        state.userInfo = user
        state.userToken = token
      })
      .addCase(authCheckThunk.rejected, (state) => {
        state.authCheck = true
      })
  },
})

export const { authChecked, resetError } = authSlice.actions

export default authSlice.reducer
