import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  editFile,
  getFilesFromDir,
  moveToBasket,
  setOrder,
  setPopupDisplay,
} from '../../store/reducers/driveSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import Container from '../container'
import { useDragDrop } from '../../hooks/dragDrop'
import { uploadFile } from '../../store/reducers/uploadSlice'
import { IDir } from '../../types/file'
import Icon from '../icon/Icon'
import { downloadFile } from '../../utils/download'
import ComponentInCenter from '../componentInCenter'
import FileItem from '../fileList/FileItem'
import Uploader from './uploader/Uploader'
import Popup from './PopUp'
import UploadButton from './UploadButton'
import ButtonWithIcon from '../buttons/ButtonWithIcon'

const Main = () => {
  const [selectedFilesId, setSelectedFilesId] = useState<string[]>([])
  const [editFileId, setEditFileId] = useState('')

  const { loading, error } = useAppSelector((state) => state.drive)
  const { isOwnFolder, currentDir, files, dirStack, order } = useAppSelector((state) => state.drive)
  const dispatch = useAppDispatch()
  const { id } = useParams()

  const dropCallback = (file: File) => dispatch(uploadFile({ file, dirId: currentDir }))
  const [dragEnter, dragEnterHandler, dragLeaveHandler, dropHandler] = useDragDrop(dropCallback)

  useEffect(() => {
    if (id) dispatch(getFilesFromDir(id))
    else dispatch(getFilesFromDir())
  }, [id])

  const handlerCreateDir = () => {
    dispatch(setPopupDisplay('flex'))
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

  const handlerSortFiles = (by: 'name' | 'date') => {
    const orderSetting = { by, direction: order.direction }
    if (order.by === by) orderSetting.direction = order.direction === 'ASC' ? 'DESC' : 'ASC'
    dispatch(setOrder(orderSetting))
  }

  const Arrow = () => {
    return order.direction === 'ASC' ? (
      <Icon name='ArrowUpIcon' size={[18, 18]} className='min-w-[20px]' />
    ) : (
      <Icon name='ArrowDownIcon' size={[18, 18]} className='min-w-[20px]' />
    )
  }

  return (
    <Container error={error} loading={loading}>
      {!dragEnter ? (
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
              <UploadButton
                uploadFile={(file) => dispatch(uploadFile({ file, dirId: currentDir }))}
              />
              <div
                className='px-2 cursor-pointer border-r-2 border-gray-900'
                onClick={handlerCreateDir}
              >
                <Icon name='FolderPlusIcon' fill='#ffffff' size={[32, 32]} />
              </div>
              {!!selectedFilesId.length && (
                <ButtonWithIcon
                  handler={() => downloadFile(selectedFilesId)}
                  iconName='DownloadIcon'
                  size={[24, 24]}
                />
              )}
              {selectedFilesId.length === 1 && (
                <ButtonWithIcon
                  iconName='EditIcon'
                  handler={() => {
                    if (!editFileId) setEditFileId(selectedFilesId[0])
                    else setEditFileId('')
                  }}
                  size={[22, 22]}
                />
              )}
              {!!selectedFilesId.length && (
                <ButtonWithIcon handler={handlerDelete} iconName='TrashIcon' size={[28, 28]} />
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
            <div
              className='col-start-3 md:col-start-2 cursor-pointer flex items-center gap-3'
              onClick={() => handlerSortFiles('name')}
            >
              Name
              {order.by === 'name' && <Arrow />}
            </div>
            <div
              className='col-start-7 cursor-pointer flex items-center gap-3'
              onClick={() => handlerSortFiles('date')}
            >
              Modified
              {order.by === 'date' && <Arrow />}
            </div>
            <div className='col-start-11'>Size</div>
          </div>
          {files.length ? (
            files.map((file, index) => (
              <FileItem
                file={file}
                key={index}
                isSelected={selectedFilesId.includes(file._id)}
                isEdited={editFileId === file._id}
                handlerSelect={handlerSelect}
                handlerEditName={handlerEditName}
              />
            ))
          ) : (
            <ComponentInCenter>The folder is empty!</ComponentInCenter>
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
      )}
    </Container>
  )
}

export default Main
