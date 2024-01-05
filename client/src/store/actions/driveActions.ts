/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ICreatedFolder, IDir } from '../../types/file'
import axios from '../../utils/axios'
import { RootState } from '../index'

const alertError = (error: any) => {
  if (error.response && error.response.data.message) return alert(error.response.data.message)
  return alert(error.message)
}

export const getFilesFromDir = createAsyncThunk(
  'file/getFiles',
  async (dirId: string | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { order } = state.drive
      const res = await axios.get(
        `/api/file?${dirId ? 'parent=' + dirId : ''}&sortBy=${order.by}&direction=${
          order.direction
        }`,
      )

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
    await axios.put(`/api/file/move?id=${id}`, { status: 'TRASHED' })

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
