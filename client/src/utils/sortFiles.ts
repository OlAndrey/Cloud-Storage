import { IFile } from '../types/file'

export const sortByName = (arr: IFile[], direction: 'ASC' | 'DESC') => {
  return arr.sort((a, b) => {
    if (direction === 'ASC') return a.name.localeCompare(b.name)
    return b.name.localeCompare(a.name)
  })
}

export const sortByDate = (arr: IFile[], direction: 'ASC' | 'DESC') => {
    return arr.sort((a, b) => {
      if (direction === 'ASC') return a.updatedAt.localeCompare(b.updatedAt)
      return b.updatedAt.localeCompare(a.updatedAt)
    })
  }
  