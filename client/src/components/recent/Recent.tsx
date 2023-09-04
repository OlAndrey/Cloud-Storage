import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getRecentFiles, getSharedFiles } from '../../store/reducers/filesSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import FileListTitle from '../fileList/FileListTitleWithAuthorData'
import FileItem from '../fileList/FileItemWithAuthorData'
import { normalizeFiles } from '../../utils/normalizeFiles'
import Title from './Title'
import { IRecentFile } from '../../types/file'
import ComponentInCenter from '../componentInCenter'
import Container from '../container'

const Recent = () => {
  const { loading, files, error } = useAppSelector((state) => state.files)
  const normalizedFiles = useMemo(() => normalizeFiles(files as IRecentFile[]), [files])
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
    <Container error={error} loading={loading}>
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
          <ComponentInCenter>{namePage} is empty!</ComponentInCenter>
        )}
      </>
    </Container>
  )
}

export default Recent
