import { useEffect } from 'react'
import Icon from '../icon/Icon'
import SideBar from '../menu/SideBar'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import FileItem from '../drive/FileItem'
import { searchFiles } from '../../store/reducers/searchSlice'
import { useNavigate, useParams } from 'react-router-dom'

const SearchResultPage = () => {
  const { error, files, loading } = useAppSelector((state) => state.search)
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const { q, dir } = params
    if (q) dispatch(searchFiles({ q, dir }))
    else navigate('/drive')
  }, [params])

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
            <div className='pt-3 px-2 md:px-4 text-base sm:text-xl'>Result search: {params.q}</div>
            {files.length ? (
              <>
                <div className='pt-3 px-2 md:px-4 grid grid-cols-12 gap-4'>
                  <div className='col-start-1'>Type</div>
                  <div className='col-start-3 md:col-start-2'>Name</div>
                  <div className='col-start-7'>Modified</div>
                  <div className='col-start-11'>Size</div>
                </div>
                {files.map((file, index) => (
                  <FileItem file={file} key={index} isSelected={false} handlerSelect={() => {}} />
                ))}
              </>
            ) : (
              <div className='pt-3 px-2 md:px-4 text-center'>None of your files or folders matched this search</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchResultPage
