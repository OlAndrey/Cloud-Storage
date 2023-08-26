/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IFile } from '../../types/file'
import axios from '../../utils/axios'

interface TrashState {
  loading: boolean
  files: IFile[]
  error: string
}

const initialState: TrashState = {
  loading: false,
  files: [],
  error: '',
}

export const getFilesFromTrash = createAsyncThunk(
  'basket/getFiles',
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

export const restoreFile = createAsyncThunk('basket/restoreFile', async (id: string) => {
  try {
    await axios.get(`/api/file/restore?id=${id}`)

    return id
  } catch (error: any) {
    if (error.response && error.response.data.message) return alert(error.response.data.message)
    return alert(error.message)
  }
})

export const deleteFile = createAsyncThunk('basket/delete', async (id: string) => {
  try {
    await axios.delete(`/api/file?id=${id}`)

    return id
  } catch (error: any) {
    if (error.response && error.response.data.message) return alert(error.response.data.message)
    return alert(error.message)
  }
})

const trashSlice = createSlice({
  name: 'trash',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFilesFromTrash.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(getFilesFromTrash.fulfilled, (state, action) => {
        const files = action.payload.files

        state.loading = false
        state.files = files
      })
      .addCase(getFilesFromTrash.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''

        state.loading = false
        state.error = errorMsg as string
      })

    builder
      .addCase(restoreFile.pending, () => undefined)
      .addCase(restoreFile.fulfilled, (state, action) => {
        const id = action.payload

        state.files = state.files.filter((file) => file._id !== id)
      })
      .addCase(restoreFile.rejected, () => undefined)

    builder
      .addCase(deleteFile.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        const fileId = action.payload

        state.loading = false
        state.files = state.files.filter((file) => file._id !== fileId)
      })
      .addCase(deleteFile.rejected, () => undefined)
  },
})

// export const { addUploadFile, changeUploadFile, hideUploader, removeUploadFile, showUploader } =
//   uploadSlice.actions
export default trashSlice.reducer
