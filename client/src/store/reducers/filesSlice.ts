/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IFile, IRecentFile } from '../../types/file'
import axios from '../../utils/axios'

interface FilesState {
  loading: boolean
  files: IRecentFile[] | IFile[]
  error: string
}

interface ISearchParams {
  q: string
  dir?: string
}

const initialState: FilesState = {
  loading: false,
  files: [],
  error: '',
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

const handlerPending = (state: FilesState) => {
  state.loading = true
  state.error = ''
}

const handlerSetFiles = (state: FilesState, action: any) => {
  const files = action.payload.files

  state.loading = false
  state.files = files
}

const handlerRejected = (state: FilesState, action: any) => {
  const errorMsg = action.payload ? action.payload : ''
  state.loading = false
  state.error = errorMsg as string
}

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecentFiles.pending, handlerPending)
      .addCase(getRecentFiles.fulfilled, handlerSetFiles)
      .addCase(getRecentFiles.rejected, handlerRejected)

    builder
      .addCase(getSharedFiles.pending, handlerPending)
      .addCase(getSharedFiles.fulfilled, handlerSetFiles)
      .addCase(getSharedFiles.rejected, handlerRejected)

    builder
      .addCase(getFilesFromTrash.pending, handlerPending)
      .addCase(getFilesFromTrash.fulfilled, handlerSetFiles)
      .addCase(getFilesFromTrash.rejected, handlerRejected)

    builder
      .addCase(restoreFile.pending, () => undefined)
      .addCase(restoreFile.fulfilled, (state, action) => {
        const id = action.payload

        state.files = state.files.filter((file) => file._id !== id)
      })
      .addCase(restoreFile.rejected, () => undefined)

    builder
      .addCase(deleteFile.pending, handlerPending)
      .addCase(deleteFile.fulfilled, (state, action) => {
        const fileId = action.payload

        state.loading = false
        state.files = state.files.filter((file) => file._id !== fileId)
      })
      .addCase(deleteFile.rejected, () => undefined)

    builder
      .addCase(searchFiles.pending, handlerPending)
      .addCase(searchFiles.fulfilled, handlerSetFiles)
      .addCase(searchFiles.rejected, handlerRejected)
  },
})

export default filesSlice.reducer
