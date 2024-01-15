import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import FileItem from '../fileList/FileItem'
import { searchFiles } from '../../store/actions/filesActions'
import { useNavigate, useParams } from 'react-router-dom'
import ComponentInCenter from '../componentInCenter'
import Container from '../container'
import FileListTitle from '../fileList/FileListTitle'

const SearchResultPage = () => {
  const { error, files, loading } = useAppSelector((state) => state.files)
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const { q, dir } = params
    if (q) dispatch(searchFiles({ q, dir }))
    else navigate('/drive')
  }, [params])

  return (
    <Container error={error} loading={loading}>
      <>
        <div className='pt-3 px-2 md:px-4 text-base sm:text-xl'>Result search: {params.q}</div>
        {files.length ? (
          <>
            <FileListTitle />
            {files.map((file, index) => (
              <FileItem file={file} key={index} isSelected={false} handlerSelect={() => {}} />
            ))}
          </>
        ) : (
          <ComponentInCenter>None of your files or folders matched this search</ComponentInCenter>
        )}
      </>
    </Container>
  )
}

export default SearchResultPage
