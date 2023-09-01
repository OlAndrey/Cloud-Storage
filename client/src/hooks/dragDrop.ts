import { DragEvent, useState } from 'react'

type DragDropType = [
    boolean,
    (event: DragEvent<HTMLDivElement>) => void,
    (event: DragEvent<HTMLDivElement>) => void,
    (event: DragEvent<HTMLDivElement>) => void
]

export const useDragDrop = (callback: (file: File) => void): DragDropType => {
  const [dragEnter, setDragEnter] = useState(false)

  const dragEnterHandler = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragEnter(true)
  }

  const dragLeaveHandler = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragEnter(false)
  }

  const dropHandler = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const files = [...event.dataTransfer.files]
    files.forEach((file) => callback(file))
    setDragEnter(false)
  }

  return [dragEnter, dragEnterHandler, dragLeaveHandler, dropHandler]
}
