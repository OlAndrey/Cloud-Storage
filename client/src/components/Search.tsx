import { FC, useState } from 'react'
import Icon from './Icon'

type SearchPropsType = {
  handler?: () => void
  hideInput?: boolean
}

const Search: FC<SearchPropsType> = ({ handler, hideInput }) => {
  const handlerFunc = typeof handler === 'function' ? handler : () => {}
  const [input, setInput] = useState('')

  const onSearchButtonClicked = (): void => {
    if (hideInput) handlerFunc()
    else {
      // TODO: do search
    }
  }

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value)
  }
  return (
    <>
      <input
        value={input}
        onChange={onSearchInputChange}
        type='text'
        placeholder='Search this folder'
        className={`h-9 w-80 max-w-md transform px-3 rounded-lg border-2 bg-zinc-900 border-zinc-400 duration-200 ${
          hideInput ? 'hidden' : ''
        }`}
      />
      <div
        onClick={onSearchButtonClicked}
        className={`${hideInput ? '' : 'relative'} w-8 right-8 cursor-pointer `}
      >
        <Icon name='MagnifyingGlassIcon' className='mt-1.5' size={[24, 24]} fill='#ffffff' />
      </div>
    </>
  )
}

export default Search
