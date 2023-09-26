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
  authCheck: false,
  userInfo: null,
  userToken: '',
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

export const deleteUser = createAsyncThunk('auth/delete', async (_, { rejectWithValue }) => {
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

export const changeAvatar = createAsyncThunk('auth/avatar', async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    for (const p of formData.entries()) console.log(p)

    const res = await axios.post('/api/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return res.data
  } catch (error: any) {
    if (error.response && error.response.data.message) return alert(error.response.data.message)
    return alert(error.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = ''
    },
    logOut: (state) => {
      window.localStorage.removeItem('userToken')

      state.userInfo = null
      state.userToken = ''
    },
    authChecked: (state) => {
      state.authCheck = true
    },
    changeUserInfo: (state, action) => {
      state.userInfo = action.payload
    }
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

    builder
      .addCase(changeAvatar.pending, () => undefined)
      .addCase(changeAvatar.fulfilled, (state, action) => {
        const user = action.payload?.user
        state.userInfo = user ? user : state.userInfo
      })
      .addCase(changeAvatar.rejected, () => undefined)
  },
})

export const { authChecked, changeUserInfo, logOut, resetError } = authSlice.actions

export default authSlice.reducer
