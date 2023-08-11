/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IFile } from '../../types/file'
import axios from '../../utils/axios'

interface FileState {
  loading: boolean
  error: string
  files: IFile[]
  currentDir: string
  dirStack: unknown
  view: string
}

const initialState: FileState = {
  loading: false,
  error: '',
  files: [],
  currentDir: '',
  dirStack: [],
  view: 'list',
}

export const getFilesFromDir = createAsyncThunk(
  'file/getFiles',
  async (dirId: string | undefined, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/file${dirId ? '?parent=' + dirId : ''}`)

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

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFilesFromDir.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(getFilesFromDir.fulfilled, (state, action) => {
        const { files } = action.payload

        state.loading = false
        state.files = files
        state.currentDir = 'drive'
      })
      .addCase(getFilesFromDir.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''
        state.loading = false
        state.error = errorMsg as string
      })
  },
})

export default fileSlice.reducer
