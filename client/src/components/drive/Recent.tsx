import { useEffect } from 'react'
import { getRecentFiles } from '../../store/reducers/fileSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import SideBar from '../menu/SideBar'
import Icon from '../icon/Icon'
import FileView from './FileView'

const Recent = () => {
  const { loading, files, error } = useAppSelector((state) => state.drive)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getRecentFiles())
  }, [])

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
            <div className='pt-3 px-2 md:px-4 text-base sm:text-xl'>Recent</div>
            <div className='pt-3 px-2 md:px-4 grid grid-cols-12 gap-4'>
              <div className='col-start-1'>Type</div>
              <div className='col-start-3 md:col-start-2'>Name</div>
              <div className='col-start-7'>Modified</div>
              <div className='col-start-11'>Size</div>
            </div>
            {files.length ? (
              files.map((file, index) => <FileView file={file} key={index} />)
            ) : (
              <div className='pt-3 px-2 md:px-4 text-center'>Recent is empty!</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Recent
