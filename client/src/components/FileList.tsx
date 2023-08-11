import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import FileView from './FileView'
import { getFilesFromDir } from '../store/reducers/fileSlice'
import Icon from './Icon'

const FileList = () => {
  const { loading, files, currentDir } = useAppSelector((state) => state.drive)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!loading) dispatch(getFilesFromDir())
  }, [])

  return (
    <div className='pt-14'>
      <div className='py-3 px-2 md:px-4 flex justify-between items-center'>
        <div className="">{currentDir}</div>
        <div className="">
            <Icon name='FolderPlusIcon' fill='#ffffff' size={[32, 32]} />
        </div>
      </div>
      <div className='px-2 md:px-4 grid grid-cols-12 gap-4'>
        <div className='col-start-1'>Type</div>
        <div className='col-start-3 md:col-start-2'>Name</div>
        <div className='col-start-7'>Modified</div>
        <div className='col-start-11'>Size</div>
      </div>
      {loading ? (
        <div className='h-full flex items-center'>
          <div className='w-screen flex justify-center items-center'>
            <Icon className='animate-spin mr-3' size={[64, 64]} fill='#ffffff' name='SpinnerIcon' />
          </div>
        </div>
      ) : files.length ? (
        files.map((file, index) => <FileView file={file} key={index} />)
      ) : (
        <div>Not find!</div>
      )}

      {/* <FileView
        file={{
          name: 'test.js',
          type: 'file',
          size: 2000,
          modified: '2023-08-08T13:53:38.156Z',
          created: '2023-08-08T13:53:38.156Z',
          accessLink: '',
        }}
      /> */}
    </div>
  )
}

export default FileList
