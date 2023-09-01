/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IRecentFile } from '../../types/file'
import axios from '../../utils/axios'

interface TrashState {
  loading: boolean
  files: IRecentFile[]
  error: string
}

const initialState: TrashState = {
  loading: false,
  files: [],
  error: '',
}


export const getRecentFiles = createAsyncThunk(
  'file/getRecentFiles',
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
  'file/getSharedFiles',
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


const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecentFiles.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(getRecentFiles.fulfilled, (state, action) => {
        const { files } = action.payload

        state.loading = false
        state.files = files
      })
      .addCase(getRecentFiles.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''
        state.loading = false
        state.error = errorMsg as string
      })

    builder
      .addCase(getSharedFiles.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(getSharedFiles.fulfilled, (state, action) => {
        const { files } = action.payload

        state.loading = false
        state.files = files
      })
      .addCase(getSharedFiles.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''
        state.loading = false
        state.error = errorMsg as string
      })
  },
})

export default recentSlice.reducer
