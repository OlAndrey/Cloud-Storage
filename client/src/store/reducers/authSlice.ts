/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ILoginUserValue, IRegisterUserValue, IUserInfo } from '../../types/auth'
import axios from '../../utils/axios'

interface AuthState {
  loading: boolean
  authCheck: boolean
  userInfo: IUserInfo | null
  userToken: string
  error: string
}

const initialState: AuthState = {
  loading: false,
  authCheck: true,
  userInfo: {
    _id: '64d3aa32bf8f7f96d196ff96',
    name: 'Andry Oleynik1',
    email: 'fortest1@test.com',
    diskSpace: 10737418240,
    usedSpace: 21335889,
    files: [],
  },
  userToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZDNhYTMyYmY4ZjdmOTZkMTk2ZmY5NiIsImlhdCI6MTY5Mzk0NTIxNywiZXhwIjoxNjk0MDMxNjE3fQ._QGYpZgdc0clUPiSRq_qF4wtb3OjeaGKdgxg3Dfis60',
  error: '',
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: IRegisterUserValue, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/auth/registration', { name, email, password })

      window.localStorage.setItem('userToken', res.data.token)
      return res.data
    } catch (error: any) {
      if (error.response && error.response.data.message)
        return rejectWithValue(error.response.data.message)
      return rejectWithValue(error.message)
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
      if (error.response && error.response.data.message)
        return rejectWithValue(error.response.data.message)
      return rejectWithValue(error.message)
    }
  },
)

export const authCheckThunk = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/auth/me')

    window.localStorage.setItem('userToken', res.data.token)
    return res.data
  } catch (error: any) {
    if (error.response && error.response.data.message)
      return rejectWithValue(error.response.data.message)
    return rejectWithValue(error.message)
  }
})

export const editName = createAsyncThunk(
  'auth/edit',
  async ({ name }: { name: string }, { rejectWithValue }) => {
    try {
      const res = await axios.put('/api/auth/editname', { name })

      return res.data
    } catch (error: any) {
      if (error.response && error.response.data.message)
        return rejectWithValue(error.response.data.message)
      return rejectWithValue(error.message)
    }
  },
)

export const editPassword = createAsyncThunk(
  'auth/password',
  async (
    { newPassword, lastPassword }: { newPassword: string; lastPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.put('/api/auth/password', { lastPassword, newPassword })

      return res.data
    } catch (error: any) {
      if (error.response && error.response.data.message)
        return rejectWithValue(error.response.data.message)
      return rejectWithValue(error.message)
    }
  },
)

export const deleteUser = createAsyncThunk('auth/delete', async (_, {rejectWithValue}) => {
  try {
    const res = await axios.delete('/api/auth')

    window.localStorage.removeItem('userToken')
    return res.data
  } catch (error: any) {
    if (error.response && error.response.data.message)
      return rejectWithValue(error.response.data.message)
    return rejectWithValue(error.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = ''
    },
    authChecked: (state) => {
      state.authCheck = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = ''
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
        state.error = ''
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

    builder
      .addCase(editName.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(editName.fulfilled, (state, action) => {
        const { user } = action.payload

        state.loading = false
        state.userInfo = user
      })
      .addCase(editName.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''
        state.loading = false
        state.error = errorMsg as string
      })

    builder
      .addCase(editPassword.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(editPassword.fulfilled, (state, action) => {
        const { user } = action.payload

        state.loading = false
        state.userInfo = user
      })
      .addCase(editPassword.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''
        state.loading = false
        state.error = errorMsg as string
      })

    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false
        state.userInfo = null
        state.userToken = ''
      })
      .addCase(deleteUser.rejected, (state, action) => {
        alert(action.payload)
        state.loading = false
      })
  },
})

export const { authChecked, resetError } = authSlice.actions

export default authSlice.reducer
