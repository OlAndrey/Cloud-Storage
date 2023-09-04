/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IFile } from '../../types/file'
import axios from '../../utils/axios'

interface ISearchParams {
  q: string
  dir?: string
}

interface SearchFileState {
  loading: boolean
  files: IFile[]
  error: string
}

const initialState: SearchFileState = {
  loading: false,
  files: [],
  error: '',
}

export const searchFiles = createAsyncThunk(
  'search/getFiles',
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

const SearchFileSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchFiles.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(searchFiles.fulfilled, (state, action) => {
        const { files } = action.payload

        state.loading = false
        state.files = files
      })
      .addCase(searchFiles.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''
        state.loading = false
        state.error = errorMsg as string
      })
  },
})

export default SearchFileSlice.reducer
