/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit'
import { IFile, IRecentFile } from '../../types/file'
import {
  deleteFile,
  getFilesFromTrash,
  getRecentFiles,
  getSharedFiles,
  restoreFile,
  searchFiles,
} from '../actions/filesActions'

interface FilesState {
  loading: boolean
  files: IRecentFile[] | IFile[]
  error: string
}

const initialState: FilesState = {
  loading: false,
  files: [],
  error: '',
}

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
