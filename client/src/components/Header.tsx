import { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { useAppSelector } from '../hooks/redux'

const Header = () => {
  const { userInfo } = useAppSelector((state) => state.auth)
  const [input, setInput] = useState('')

  const onSearchButtonClicked = (): void => {
    // TODO: do search
  }

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value)
  }

  const mainMenu: ReactNode = (
    <>
      <div className='flex flex-grow items-center justify-between'>
        <div className='flex'>
          <input
            value={input}
            onChange={onSearchInputChange}
            type='text'
            placeholder='Search this folder'
            className=' h-9 w-80 max-w-md transform px-3 rounded-lg border-2 bg-zinc-900 border-zinc-400 duration-200'
          />
          <div onClick={onSearchButtonClicked} className='relative w-8 right-8 cursor-pointer'>
            <Icon name='MagnifyingGlassIcon' className='mt-1.5' size={[24, 24]} fill='#ffffff' />
          </div>
        </div>

        <Link
          to='/preferences'
          className='mx-4 flex h-10 w-10 items-center justify-center rounded-lg'
        >
          <Icon name='GearIcon' size={[36, 36]} fill='none' />
        </Link>
      </div>
    </>
  )

  return (
    <div
      className={`fixed h-14 w-screen flex items-center ${
        userInfo ? 'border-b border-gray-5' : ''
      }`}
    >
      <div className='pl-8 w-64'>
        <Link to='#' className='block w-24 cursor-pointer'>
          Logo
        </Link>
      </div>

      <div className='px-2 flex flex-grow items-center justify-between'>
        {!userInfo ? <div /> : mainMenu}
      </div>
    </div>
  )
}

export default Header
