import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getRecentFiles, getSharedFiles } from '../../store/reducers/recentSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import SideBar from '../menu/SideBar'
import Icon from '../icon/Icon'
import FileListTitle from './FileListTitle'
import FileItem from './FileItem'
import { normalizeFiles } from '../../utils/normalizeFiles'
import Title from './Title'

const Recent = () => {
  const { loading, files, error } = useAppSelector((state) => state.recent)
  const normalizedFiles = useMemo(() => normalizeFiles(files), [files])
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const namePage = location.pathname === '/recent' ? 'Recent' : 'Shared'

  useEffect(() => {
    switch (location.pathname) {
      case '/recent':
        dispatch(getRecentFiles())
        break

      case '/shared':
        dispatch(getSharedFiles())
        break

      default:
        navigate('/drive')
        break
    }
  }, [location])

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
            <div className='pt-3 px-2 md:px-4 text-base sm:text-xl'>{namePage}</div>

            <FileListTitle />
            {normalizedFiles.length ? (
              normalizedFiles.map((file, index) =>
                file.type === 'title' ? (
                  <Title date={file.date} key={index} />
                ) : (
                  <FileItem file={file.data} key={index} />
                ),
              )
            ) : (
              <div className='pt-3 px-2 md:px-4 text-center'>{namePage} is empty!</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Recent
