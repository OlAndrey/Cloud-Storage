import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { deleteFile, getFilesFromTrash, restoreFile } from '../../store/reducers/filesSlice'
import Icon from '../icon/Icon'
import FileItem from '../fileList/FileItem'
import Container from '../container'
import ComponentInCenter from '../componentInCenter'
import FileListTitle from '../fileList/FileListTitle'

const Trash = () => {
  const [selectedFilesId, setSelectedFilesId] = useState<string[]>([])
  const { error, files, loading } = useAppSelector((state) => state.files)
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
    <Container error={error} loading={loading}>
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
        <FileListTitle />
        {files.length ? (
          files.map((file, index) => (
            <FileItem
              file={file}
              key={index}
              isSelected={selectedFilesId.includes(file._id)}
              handlerSelect={handlerSelect}
            />
          ))
        ) : (
          <ComponentInCenter>Trash is empty!</ComponentInCenter>
        )}
      </>
    </Container>
  )
}

export default Trash
