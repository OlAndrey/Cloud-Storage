/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ILoginUserValue, IRegisterUserValue } from '../../types/auth'
import axios from '../../utils/axios'

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
