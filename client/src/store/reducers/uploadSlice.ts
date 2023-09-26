/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IUploadFile, IUploadFileProcess } from '../../types/file'
import { addFile } from './driveSlice'

interface UploadState {
  isVisible: boolean
  files: IUploadFileProcess[]
}

const initialState: UploadState = {
  isVisible: false,
  files: [],
}

export const uploadFile = createAsyncThunk(
  'file/uploadFile',
  async ({ file, dirId }: IUploadFile, { dispatch }) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (dirId) {
        formData.append('parent', dirId)
      }

      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      const uploadFile: IUploadFileProcess = {
        name: file.name,
        progress: 0,
        id: '' + Date.now(),
        closeUpload: source.cancel,
      }

      dispatch(showUploader())
      dispatch(addUploadFile(uploadFile))

      const res = await axios.post('http://localhost:5000/api/file/upload', formData, {
        headers: {
          Authorization: window.localStorage.getItem('userInfo'),
          'Content-Type': 'multipart/form-data',
        },
        cancelToken: source.token,
        onUploadProgress: (progressEvent) => {
          const newUploadFile = { ...uploadFile }
          const progress = progressEvent.progress ? progressEvent.progress : 0
          newUploadFile.progress = Math.round(progress * 100)

          dispatch(changeUploadFile(newUploadFile))
        },
      })

      dispatch(addFile(res.data.file))
      return res.data
    } catch (error: any) {
      if (error.response && error.response.data.message) return alert(error.response.data.message)
      return alert(error.message)
    }
  },
)

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    showUploader: (state) => {
      state.isVisible = true
    },
    hideUploader: (state) => {
      state.isVisible = false
    },
    addUploadFile: (state, action) => {
      const file = action.payload
      state.files = [...state.files, file]
    },
    removeUploadFile: (state, action) => {
      state.files = state.files.filter((file) => file.id != action.payload)
    },
    changeUploadFile: (state, action) => {
      state.files = state.files.map((file) =>
        file.id == action.payload.id ? { ...file, progress: action.payload.progress } : { ...file },
      )
    },
  },
  extraReducers: () => {},
})

export const { addUploadFile, changeUploadFile, hideUploader, removeUploadFile, showUploader } =
  uploadSlice.actions
export default uploadSlice.reducer
