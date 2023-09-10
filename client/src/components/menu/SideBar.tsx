import { useState } from 'react'
import Search from '../search/Search'
import SideBarItem from './SideBarItem'
import { useAppSelector } from '../../hooks/redux'

const SideBar = () => {
  const [hideMenu, setHideMenu] = useState(true)

  const { userInfo } = useAppSelector((state) => state.auth)

  const percent = userInfo
    ? Math.round(
        ((userInfo.diskSpace - (userInfo.diskSpace - userInfo.usedSpace)) / userInfo.diskSpace) *
          100,
      )
    : 0

  return (
    <div
      className={`h-screen fixed z-20 bg-default w-16 sm:w-48 lg:w-64 pt-14 flex flex-col duration-200 transition-all ${
        hideMenu ? '' : 'w-screen'
      }`}
    >
      <div className='flex flex-grow flex-col border-r border-gray-5 px-2'>
        <div className='mt-2'>
          <SideBarItem label={'Drive'} to='/drive' iconName='FolderIcon' hideLabel={hideMenu} />
          <SideBarItem
            label={'Shared with me'}
            to='/shared'
            iconName='ChainIcon'
            hideLabel={hideMenu}
          />
          <SideBarItem label={'Recents'} to='/recent' iconName='ClockIcon' hideLabel={hideMenu} />
          <SideBarItem label={'Trash'} to='/trash' iconName='TrashIcon' hideLabel={hideMenu} />
        </div>

        <div className='sm:hidden mt-8'>
          <SideBarItem label={'Setting'} to='#' iconName='GearIcon' hideLabel={hideMenu} />
        </div>

        <div className='mt-2 block sm:hidden mt-2 pl-3'>
          <Search hideInput={hideMenu} handler={() => setHideMenu(false)} />
        </div>

        <button
          className={`sm:hidden w-8 h-8 rounded-full border-l border-gray-5 bg-black absolute top-1/2 ${
            hideMenu ? ' -right-4' : 'right-0'
          }`}
          onClick={() => setHideMenu(!hideMenu)}
        >
          {hideMenu ? '>' : '<'}
        </button>

        <div className='mt-auto text-right md:px-5'>{percent + '%'}</div>
        <div className='w-full mt-2 mb-11 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
          <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: percent + '%' }}></div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
