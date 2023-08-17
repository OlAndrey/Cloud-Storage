/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ICreatedFolder, IUploadFile, IDir, IFile } from '../../types/file'
import axios from '../../utils/axios'

interface FileState {
  loading: boolean
  error: string
  isOwnFolder: boolean
  files: IFile[]
  currentDir: string
  dirStack: IDir[]
  view: string
  popUpDisplay: 'none' | 'flex'
}

const initialState: FileState = {
  loading: false,
  error: '',
  isOwnFolder: false,
  files: [],
  currentDir: '',
  dirStack: [],
  view: 'list',
  popUpDisplay: 'none',
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

export const createDir = createAsyncThunk(
  'file/createDir',
  async ({ name, parent }: ICreatedFolder) => {
    try {
      const res = await axios.post('/api/file', {
        name,
        type: 'dir',
        parent,
      })

      return res.data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return alert(error.response.data.message)
      } else {
        return alert(error.message)
      }
    }
  },
)

export const uploadFile = createAsyncThunk(
  'file/uploadFile',
  async({file, dirId }: IUploadFile)=> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (dirId) {
          formData.append('parent', dirId)
      }
      const res = await axios.post('/api/file/upload', formData)

      return res.data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return alert(error.response.data.message)
      } else {
        return alert(error.message)
      }
    }
  }
)

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setPopupDisplay: (state, action: PayloadAction<'none' | 'flex'>) => {
      state.popUpDisplay = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilesFromDir.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(getFilesFromDir.fulfilled, (state, action) => {
        const { files, isOwn, currentDir, stackDir } = action.payload

        state.loading = false
        state.files = files
        state.currentDir = currentDir ? currentDir._id : ''
        state.isOwnFolder = isOwn
        state.dirStack = [{ id: null, name: 'Drive' }, ...stackDir]
      })
      .addCase(getFilesFromDir.rejected, (state, action) => {
        const errorMsg = action.payload ? action.payload : ''
        state.loading = false
        state.error = errorMsg as string
      })

    builder
      .addCase(createDir.pending, () => undefined)
      .addCase(createDir.fulfilled, (state, action) => {
        const file = action.payload?.file

        state.loading = false
        state.files = file ? [...state.files, file] : state.files
      })
      .addCase(createDir.rejected, () => undefined)
      
    builder
    .addCase(uploadFile.pending, () => undefined)
    .addCase(uploadFile.fulfilled, (state, action) => {
      const file = action.payload?.file

      state.loading = false
      state.files = file ? [...state.files, file] : state.files
    })
    .addCase(uploadFile.rejected, () => undefined)
  },
})

export const { setPopupDisplay } = fileSlice.actions

export default fileSlice.reducer
