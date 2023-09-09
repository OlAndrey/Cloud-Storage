import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../icon/Icon'
import { useAppSelector } from '../../hooks/redux'
import Search from '../search/Search'

const Header = () => {
  const { userInfo } = useAppSelector((state) => state.auth)

  const mainMenu: ReactNode = (
    <div className='hidden sm:flex flex-grow items-center justify-between'>
      <div className='hidden sm:block grow'>
        <Search />
      </div>

      <Link
        to='/preferences'
        className='mx-4 flex h-10 w-10 items-center justify-center rounded-lg'
      >
        <Icon name='GearIcon' size={[36, 36]} fill='none' />
      </Link>
    </div>
  )

  return (
    <div
      className={`fixed z-30 bg-default h-14 w-screen flex items-center ${
        userInfo ? 'border-b border-gray-5' : ''
      }`}
    >
      <div className='pl-8 w-32 md:w-64'>
        <Link to='#' className='block w-24 cursor-pointer'>
          Logo
        </Link>
      </div>

      <div className='px-2 flex flex-grow items-center justify-end md:justify-between'>
        {!userInfo ? <div /> : mainMenu}
      </div>
    </div>
  )
}

export default Header
