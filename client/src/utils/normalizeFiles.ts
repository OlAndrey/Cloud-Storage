/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs'
import { IRecentFile } from '../types/file'

export const normalizeFiles = (files: IRecentFile[]) => {
  const newFiles: any[] = []

  if (!files.length) return newFiles

  files.forEach((item, i) => {
    if (i === 0 || files[i - 1]) {
      const first = dayjs((i === 0 ? item : files[i - 1]).newlyOpened)
      const second = dayjs(item.newlyOpened)
      const diff = second.diff(first, 'day')

      if (i === 0 || diff) {
        newFiles.push({
          type: 'title',
          date: item.newlyOpened,
        })
      }
    }

    newFiles.push({
      type: 'file',
      data: { ...item },
    })
  })

  return newFiles
}
