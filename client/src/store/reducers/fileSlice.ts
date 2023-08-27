/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ICreatedFolder, IDir, IFile, IOrderSettings } from '../../types/file'
import axios from '../../utils/axios'
import { sortByDate, sortByName } from '../../utils/sortFiles'

interface FileState {
  loading: boolean
  error: string
  isOwnFolder: boolean
  files: IFile[]
  currentDir: string
  dirStack: IDir[]
  order: IOrderSettings
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
  order: { by: 'name', direction: 'ASC' },
  view: 'list',
  popUpDisplay: 'none',
}

const alertError = (error: any) => {
  if (error.response && error.response.data.message) return alert(error.response.data.message)
  return alert(error.message)
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
      alertError(error)
    }
  },
)

export const moveToBasket = createAsyncThunk('file/move', async (id: string) => {
  try {
    await axios.put(`/api/file/move?id=${id}`, {})

    return id
  } catch (error: any) {
    alertError(error)
  }
})

export const editFile = createAsyncThunk('file/edit', async (data: IDir) => {
  try {
    const res = await axios.put('/api/file', data)

    return res.data
  } catch (error: any) {
    alertError(error)
  }
})

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<IOrderSettings>) => {
      const { by, direction } = action.payload
      state.files =
        by === 'name' ? sortByName(state.files, direction) : sortByDate(state.files, direction)
      state.order = action.payload
    },
    setPopupDisplay: (state, action: PayloadAction<'none' | 'flex'>) => {
      state.popUpDisplay = action.payload
    },
    addFile: (state, action: PayloadAction<IFile>) => {
      const file = action.payload
      state.files = file ? [...state.files, file] : state.files
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
        state.files = file ? [...state.files, file] : state.files
      })
      .addCase(createDir.rejected, () => undefined)

    builder.addCase(moveToBasket.fulfilled, (state, action) => {
      const fileId = action.payload

      state.files = state.files.filter((file) => file._id !== fileId)
    })

    builder
      .addCase(editFile.pending, () => undefined)
      .addCase(editFile.fulfilled, (state, action) => {
        const editedFile = action.payload?.file

        state.files = state.files.map((file) => {
          if (file._id !== editedFile._id) return file
          return editedFile
        })
      })
      .addCase(editFile.rejected, () => undefined)
  },
})

export const { addFile, setOrder, setPopupDisplay } = fileSlice.actions

export default fileSlice.reducer
