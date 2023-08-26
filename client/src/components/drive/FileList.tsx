import { ChangeEvent, DragEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import FileView from './FileView'
import { moveToBasket, editFile, setPopupDisplay } from '../../store/reducers/fileSlice'
import { uploadFile } from '../../store/reducers/uploadSlice'
import Icon from '../icon/Icon'
import Popup from './PopUp'
import { downloadFile } from '../../utils/download'
import { IDir } from '../../types/file'
import Uploader from './uploader/Uploader'

const FileList = () => {
  const [selectedFilesId, setSelectedFilesId] = useState<string[]>([])
  const [editFileId, setEditFileId] = useState('')
  const [dragEnter, setDragEnter] = useState(false)
  const { isOwnFolder, currentDir, files, dirStack } = useAppSelector(
    (state) => state.drive,
  )
  const dispatch = useAppDispatch()

  const handlerCreateDir = () => {
    dispatch(setPopupDisplay('flex'))
  }

  const handlerFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) {
      const files = [...e.target.files]
      files.forEach((file) => dispatch(uploadFile({ file, dirId: currentDir })))
    }
  }

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
    files.forEach((file) => dispatch(uploadFile({ file, dirId: currentDir })))
    setDragEnter(false)
  }

  const handlerSelect = (fileId: string) => {
    if (selectedFilesId.length === 1) setEditFileId('')
    if (selectedFilesId.includes(fileId))
      setSelectedFilesId(selectedFilesId.filter((selectFile) => selectFile !== fileId))
    else setSelectedFilesId([...selectedFilesId, fileId])
  }

  const handlerEditName = (newName: IDir) => {
    dispatch(editFile(newName))
    setEditFileId('')
  }

  const handlerDelete = () => {
    setSelectedFilesId([])
    selectedFilesId.forEach((id) => dispatch(moveToBasket(id)))
  }

  return !dragEnter ? (
    <div
      className='h-full'
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
    >
      {isOwnFolder ? (
        <div className='pt-3 px-2 md:px-4 flex justify-between items-center'>
          <div className='flex flex-wrap flex-grow'>
            {dirStack.map((parent, ind, stack) => (
              <div key={ind} className='pr-2 sm:px-2 text-base sm:text-xl'>
                {ind !== stack.length - 1 ? (
                  <Link
                    to={`/drive/${parent.id ? 'folders/' + parent.id : ''}`}
                    className='hover:text-blue-500'
                  >
                    {parent.name}&nbsp;&#47;&nbsp;
                  </Link>
                ) : (
                  <div className='font-semibold'>{parent.name}</div>
                )}
              </div>
            ))}
          </div>
          <label
            htmlFor='upload-input'
            className='flex items-center rounded-xl bg-blue-700 mx-2 px-2 py-1 sm:px-4 sm:py-1.5 text-md cursor-pointer transition duration-150 ease-in-out hover:bg-blue-800'
          >
            <Icon name='UploadIcon' fill='#ffffff' size={[24, 24]} />
            <span className='hidden ml-2 sm:inline'>Upload Files</span>
            <input
              type='file'
              multiple={true}
              onChange={handlerFileUpload}
              id='upload-input'
              className='hidden'
            />
          </label>
          <div
            className='px-2 cursor-pointer border-r-2 border-gray-900'
            onClick={handlerCreateDir}
          >
            <Icon name='FolderPlusIcon' fill='#ffffff' size={[32, 32]} />
          </div>
          {!!selectedFilesId.length && (
            <button
              className='pl-3 transition duration-150 ease-in-out'
              onClick={() => downloadFile(selectedFilesId)}
            >
              <Icon name='DownloadIcon' fill='#ffffff' size={[24, 24]} />
            </button>
          )}
          {selectedFilesId.length === 1 && (
            <button
              className='pl-3 transition duration-150 ease-in-out'
              onClick={() => {
                if (!editFileId) setEditFileId(selectedFilesId[0])
                else setEditFileId('')
              }}
            >
              <Icon name='EditIcon' fill='#ffffff' size={[22, 22]} />
            </button>
          )}
          {!!selectedFilesId.length && (
            <button
              className='pl-2 transition duration-150 ease-in-out'
              onClick={handlerDelete}
            >
              <Icon name='TrashIcon' fill='#ffffff' size={[28, 28]} />
            </button>
          )}
        </div>
      ) : (
        <div className='pt-3 px-2 md:px-4 flex justify-end items-center'>
          <button
            className='flex ml-auto items-center rounded-xl bg-blue-700 px-2 py-1 sm:px-4 sm:py-1.5 transition duration-150 ease-in-out hover:bg-blue-800'
            disabled={files.length === 0}
            onClick={() => {
              if (selectedFilesId.length < 1) downloadFile(files.map((file) => file._id))
              else downloadFile(selectedFilesId)
            }}
          >
            <Icon name='DownloadIcon' className='mr-2' fill='#ffffff' size={[24, 24]} />
            {selectedFilesId.length < 1 ? 'Download all' : 'Download selected'}
          </button>
        </div>
      )}
      <div className='pt-3 px-2 md:px-4 grid grid-cols-12 gap-4'>
        <div className='col-start-1'>Type</div>
        <div className='col-start-3 md:col-start-2'>Name</div>
        <div className='col-start-7'>Modified</div>
        <div className='col-start-11'>Size</div>
      </div>
      {files.length ? (
        files.map((file, index) => (
          <FileView
            file={file}
            key={index}
            isSelected={selectedFilesId.includes(file._id)}
            isEdited={editFileId === file._id}
            handlerSelect={handlerSelect}
            handlerEditName={handlerEditName}
          />
        ))
      ) : (
        <div className='pt-3 px-2 md:px-4 text-center'>The folder is empty!</div>
      )}

        <Uploader />
      <Popup />
    </div>
  ) : (
    <div
      className='h-100-1em m-2 -mb-4 border-2 border-blue-500 rounded bg-blue-500/25 flex direction-column items-center'
      onDrop={dropHandler}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
    >
      <div className='w-full flex justify-center'>Drag files here</div>
    </div>
  )
}

export default FileList
