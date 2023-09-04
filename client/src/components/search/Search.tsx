import { FC, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Icon from '../icon/Icon'
import { useAppSelector } from '../../hooks/redux'
import { IFile } from '../../types/file'
import SearchResultItem from './SearchResultItem'

type SearchPropsType = {
  handler?: () => void
  hideInput?: boolean
}

const Search: FC<SearchPropsType> = ({ handler, hideInput }) => {
  const { files, currentDir } = useAppSelector((state) => state.drive)
  const handlerFunc = typeof handler === 'function' ? handler : () => {}
  const [input, setInput] = useState('')
  const [result, setResult] = useState<IFile[]>([])

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if(location.pathname.includes('/search')) setResult([])
  }, [location])

  const onSearchButtonClicked = (): void => {
    if (hideInput) handlerFunc()
    if (input.trim()) {
      navigate(`/search/${input}${currentDir ? '/' + currentDir : ''}`)
    }
  }

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target
    setInput(value)
    if (value.length >= 3)
      setResult(files.filter((file) => file.name.toLowerCase().includes(value.toLowerCase())))
    else setResult([])
  }

  return (
    <div className='relative w-96 max-w-full'>
      <div className='relative flex w-full rounded-t-lg border-2 border-zinc-400'>
        <input
          value={input}
          onChange={onSearchInputChange}
          type='text'
          placeholder='Search this folder'
          className={`h-9 w-full rounded-t-lg bg-zinc-900 transform px-3 duration-200 ${
            hideInput ? 'hidden' : ''
          }`}
        />
        <div
          onClick={onSearchButtonClicked}
          className={`${hideInput ? '' : 'absolute'} w-8 right-0 cursor-pointer `}
        >
          <Icon name='MagnifyingGlassIcon' className='mt-1.5' size={[24, 24]} fill='#ffffff' />
        </div>
      </div>
      <div
        className={`absolute hidden sm:block ${
          result.length > 0 ? 'w-full rounded-b-lg border-x-2 border-b-2 border-zinc-400' : ''
        } bg-default z-10`}
      >
        <ul>
          {result.map((item, ind) => (
            <SearchResultItem key={ind} file={item} navigate={navigate} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Search
