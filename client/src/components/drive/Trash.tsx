import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { deleteFile, getFilesFromTrash, restoreFile } from '../../store/reducers/trashSlice'
import Icon from '../icon/Icon'
import SideBar from '../menu/SideBar'
import FileView from './FileView'

const Trash = () => {
  const [selectedFilesId, setSelectedFilesId] = useState<string[]>([])
  const { error, files, loading } = useAppSelector((state) => state.trash)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getFilesFromTrash())
  }, [])

  const handlerSelect = (fileId: string) => {
    if (selectedFilesId.includes(fileId))
      setSelectedFilesId(selectedFilesId.filter((selectFile) => selectFile !== fileId))
    else setSelectedFilesId([...selectedFilesId, fileId])
  }

  const handlerRestore = () => {
    setSelectedFilesId([])
    selectedFilesId.forEach((id) => dispatch(restoreFile(id)))
  }

  const handlerDelete = () => {
    setSelectedFilesId([])
    selectedFilesId.forEach((id) => dispatch(deleteFile(id)))
  }

  return (
    <div className='w-screen flex'>
      <SideBar />
      <div className='w-full pt-14 grow'>
        {error ? (
          <div className='h-full flex items-center'>
            <div className='w-full -ml-14 flex justify-center items-center font-medium text-lg'>
              {error}
            </div>
          </div>
        ) : loading ? (
          <div className='h-full flex items-center'>
            <div className='w-full -ml-14 flex justify-center items-center'>
              <Icon
                className='animate-spin mr-3'
                size={[64, 64]}
                fill='#ffffff'
                name='SpinnerIcon'
              />
            </div>
          </div>
        ) : (
          <>
            <div className='pt-3 px-2 md:px-4 flex justify-between align-center'>
              <div className='text-base sm:text-xl flex-grow'>Trash</div>
              <button className='pl-2' onClick={handlerRestore}>
                <Icon
                  name='RestoreIcon'
                  className='transition duration-150 ease-in-out hover:scale-110'
                  fill='#232327'
                  size={[28, 28]}
                />
              </button>
              <button className='pl-2' onClick={handlerDelete}>
                <Icon
                  name='TrashIcon'
                  className='transition duration-150 ease-in-out hover:scale-110'
                  fill='#ffffff'
                  size={[28, 28]}
                />
              </button>
            </div>
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
                  handlerSelect={handlerSelect}
                />
              ))
            ) : (
              <div className='pt-3 px-2 md:px-4 text-center'>Trash is empty!</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Trash
