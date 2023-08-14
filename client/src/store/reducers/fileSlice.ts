/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ICreatedFolder, IFile } from '../../types/file'
import axios from '../../utils/axios'

interface FileState {
  loading: boolean
  error: string
  files: IFile[]
  currentDir: string
  dirStack: unknown
  view: string
  popUpDisplay: 'none' | 'flex'
}

const initialState: FileState = {
  loading: false,
  error: '',
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

    builder
      .addCase(createDir.pending, () => undefined)
      .addCase(createDir.fulfilled, (state, action) => {
        const file = action.payload?.file

        state.loading = false
        state.files = file ? [...state.files, file]: state.files
      })
      .addCase(createDir.rejected, () => undefined)
  },
})

export const { setPopupDisplay } = fileSlice.actions

export default fileSlice.reducer
