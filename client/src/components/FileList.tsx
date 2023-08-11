import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import FileView from './FileView'
import { getFilesFromDir } from '../store/reducers/fileSlice'
import Icon from './Icon'

const FileList = () => {
  const { loading, error, files, currentDir } = useAppSelector((state) => state.drive)
  const { userInfo } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const { id } = useParams()

  useEffect(() => {
    if (id) dispatch(getFilesFromDir(id))
    else dispatch(getFilesFromDir())
  }, [])

  return (
    <div className='pt-14'>
      {error ? (
        <div className='h-full flex items-center'>
          <div className='w-screen -ml-14 flex justify-center items-center font-medium text-lg'>{error}</div>
        </div>
      ) : loading ? (
        <div className='h-full flex items-center'>
          <div className='w-screen -ml-14 flex justify-center items-center'>
            <Icon className='animate-spin mr-3' size={[64, 64]} fill='#ffffff' name='SpinnerIcon' />
          </div>
        </div>
      ) : (
        <>
          {userInfo?._id === (files.length && files[0].user) ? (
            <div className='pt-3 px-2 md:px-4 flex justify-between items-center'>
              <div className=''>{currentDir}</div>
              <div className=''>
                <Icon name='FolderPlusIcon' fill='#ffffff' size={[32, 32]} />
              </div>
            </div>
          ) : (
            ''
          )}
          <div className='pt-3 px-2 md:px-4 grid grid-cols-12 gap-4'>
            <div className='col-start-1'>Type</div>
            <div className='col-start-3 md:col-start-2'>Name</div>
            <div className='col-start-7'>Modified</div>
            <div className='col-start-11'>Size</div>
          </div>
          {files.length ? (
            files.map((file, index) => <FileView file={file} key={index} />)
          ) : (
            <div>Not find!</div>
          )}
        </>
      )}
    </div>
  )
}

export default FileList
