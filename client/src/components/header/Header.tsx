import { ReactNode, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../icon/Icon'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import Search from '../search/Search'
import PictureAvatar from '../image/PictureAvatar'
import { logOut } from '../../store/reducers/authSlice'

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { userInfo } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const percent = userInfo
    ? Math.round(
        ((userInfo.diskSpace - (userInfo.diskSpace - userInfo.usedSpace)) / userInfo.diskSpace) *
          100,
      )
    : 0

  const wait = (time: number) => {
    return (callback: () => void) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, time)
      }).then(() => callback())
    }
  }

  const mainMenu: ReactNode = (
    <div className='relative flex flex-grow items-center justify-end sm:justify-between px-3'>
      <div className='hidden sm:block grow'>
        <Search />
      </div>

      <Link
        to='/preferences'
        className='hidden sm:block mx-4 flex h-10 w-10 items-center justify-center rounded-lg'
      >
        <Icon name='GearIcon' size={[36, 36]} fill='none' />
      </Link>

      <button
        onFocus={() => setIsModalOpen(true)}
        onBlur={wait(150).bind(undefined, () => setIsModalOpen(false))}
      >
        <PictureAvatar src={`${process.env.REACT_APP_API_URL}/${userInfo?.avatarUrl}`} diameter={36} />
      </button>
      <div
        className={`z-10 absolute top-10 right-2 py-2 ${
          isModalOpen ? 'block' : 'hidden'
        } w-34 bg-default rounded-lg border border-gray-10 p-1`}
        onClick={() => setIsModalOpen(false)}
      >
        <div className='flex items-center p-3'>
          <PictureAvatar src={`${process.env.REACT_APP_API_URL}/${userInfo?.avatarUrl}`} diameter={36} />
          <div className='ml-2 min-w-0'>
            <h1 className='truncate font-medium' style={{ lineHeight: 1 }}>
              {userInfo?.name}
            </h1>
            <h2 className='truncate text-sm text-gray-400'>{userInfo?.email}</h2>
          </div>
        </div>
        <div className='py-2 px-4 flex justify-between items-center'>
          <div className='text-xs text-gray-400'>{percent}% space used</div>
          <button
            className='text-sm text-blue-600 transition duration-150 ease-in-out hover:text-blue-700'
            onClick={() => navigate('/preferences?tab=plans')}
          >
            Upgrade
          </button>
        </div>
        <ul className=' text-sm text-gray-400'>
          <li
            className='flex gap-2 items-center px-4 py-2 cursor-pointer hover:text-white hover:bg-blue-500 hover:bg-opacity-10'
            onClick={() => {
              navigate('/preferences')
            }}
          >
            <Icon name='GearIcon' size={[24, 24]} fill='none' />
            Settings
          </li>
          <li
            className='flex gap-2 items-center px-4 py-2 cursor-pointer hover:text-white hover:bg-blue-500 hover:bg-opacity-10'
            onClick={() => dispatch(logOut())}
          >
            <Icon name='LogOutIcon' size={[24, 24]} fill='none' />
            Log out
          </li>
        </ul>
      </div>
    </div>
  )

  return (
    <div
      className={`fixed z-30 bg-default h-14 w-screen flex items-center ${
        userInfo ? 'border-b border-gray-5' : ''
      }`}
    >
      <div className='pl-8 w-48 lg:w-64'>
        <Link to='/' className='block w-full text-xl font-bold cursor-pointer transition duration-200 ease-in-out hover:text-blue-500'>
          Cloud Storage
        </Link>
      </div>

      <div className='px-2 flex flex-grow items-center justify-end md:justify-between'>
        {!userInfo ? <div /> : mainMenu}
      </div>
    </div>
  )
}

export default Header
