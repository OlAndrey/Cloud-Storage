import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getFilesFromDir } from '../../store/reducers/fileSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import FileList from './FileList'
import SideBar from '../menu/SideBar'
import Icon from '../icon/Icon'

const Main = () => {
  const { loading, error } = useAppSelector((state) => state.drive)
  const dispatch = useAppDispatch()
  const { id } = useParams()

  useEffect(() => {
    if (id) dispatch(getFilesFromDir(id))
    else dispatch(getFilesFromDir())
  }, [id])

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
          <FileList />
        )}
      </div>
    </div>
  )
}

export default Main
