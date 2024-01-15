import { createSlice } from '@reduxjs/toolkit'
import { IUserInfo } from '../../types/auth'
import {
  authCheckThunk,
  changeAvatar,
  deleteUser,
  editName,
  editPassword,
  loginUser,
  recoveryPassword,
  registerUser,
} from '../actions/authActions'

interface AuthState {
  loading: boolean
  authCheck: boolean
  userInfo: IUserInfo | null
  userToken: string
  info: string
  error: string
}

const initialState: AuthState = {
  loading: false,
  authCheck: false,
  userInfo: null,
  userToken: '',
  info: '',
  error: '',
}

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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.info = 'Your account has been created, please activate it'
      })
      .addCase(registerUser.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''
        state.loading = false
        state.error = errorMsg as string
      })

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.info = ''
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
        state.info = ''
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
      .addCase(recoveryPassword.pending, (state) => {
        state.loading = true
        state.info = ''
        state.error = ''
      })
      .addCase(recoveryPassword.fulfilled, (state, action) => {
        const { user, token } = action.payload

        state.loading = false
        state.userInfo = user
        state.userToken = token
      })
      .addCase(recoveryPassword.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''
        state.loading = false
        state.error = errorMsg as string
      })

    builder
      .addCase(editPassword.pending, (state) => {
        state.loading = true
        state.info = ''
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
