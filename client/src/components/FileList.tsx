import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import FileView from './FileView'
import { getFilesFromDir, setPopupDisplay } from '../store/reducers/fileSlice'
import Icon from './Icon'
import Popup from './PopUp'

const FileList = () => {
  const { loading, error, isOwnFolder, files, dirStack } = useAppSelector((state) => state.drive)
  const dispatch = useAppDispatch()
  const { id } = useParams()

  useEffect(() => {
    if (id) dispatch(getFilesFromDir(id))
    else dispatch(getFilesFromDir())
  }, [id])

  const handlerCreateDir = () => {
    dispatch(setPopupDisplay('flex'))
  }

  return (
    <div className='pt-14 grow'>
      {error ? (
        <div className='h-full flex items-center'>
          <div className='w-screen -ml-14 flex justify-center items-center font-medium text-lg'>
            {error}
          </div>
        </div>
      ) : loading ? (
        <div className='h-full flex items-center'>
          <div className='w-screen -ml-14 flex justify-center items-center'>
            <Icon className='animate-spin mr-3' size={[64, 64]} fill='#ffffff' name='SpinnerIcon' />
          </div>
        </div>
      ) : (
        <>
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
              <div onClick={() => handlerCreateDir()}>
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
            <div className='pt-3 px-2 md:px-4 text-center'>The folder is empty!</div>
          )}
        </>
      )}
      <Popup />
    </div>
  )
}

export default FileList
