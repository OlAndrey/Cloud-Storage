/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

interface ISearchParams {
  q: string
  dir?: string
}

export const getRecentFiles = createAsyncThunk(
  'files/getRecentFiles',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/recent')

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

export const getSharedFiles = createAsyncThunk(
  'files/getSharedFiles',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/recent/shared')

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

export const getFilesFromTrash = createAsyncThunk(
  'files/getFilesFromTrash',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/file/trash')

      return res.data
    } catch (error: any) {
      if (error.response && error.response.data.message)
        return rejectWithValue(error.response.data.message)
      return rejectWithValue(error.message)
    }
  },
)

export const restoreFile = createAsyncThunk('files/restoreFileFromTrash', async (id: string) => {
  try {
    await axios.get(`/api/file/restore?id=${id}`)

    return id
  } catch (error: any) {
    if (error.response && error.response.data.message) return alert(error.response.data.message)
    return alert(error.message)
  }
})

export const deleteFile = createAsyncThunk('files/deleteFile', async (id: string) => {
  try {
    await axios.delete(`/api/file?id=${id}`)

    return id
  } catch (error: any) {
    if (error.response && error.response.data.message) return alert(error.response.data.message)
    return alert(error.message)
  }
})

export const searchFiles = createAsyncThunk(
  'files/search',
  async ({ q, dir }: ISearchParams, { rejectWithValue }) => {
    try {
      const res = await axios.get(`api/file/search?search=${q + (dir ? '&dir=' + dir : '')}`)

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
