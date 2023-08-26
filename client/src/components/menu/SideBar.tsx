import { useState } from 'react'
import Search from '../search/Search'
import SideBarItem from './SideBarItem'

const SideBar = () => {
  const [hideMenu, setHideMenu] = useState(true)

  return (
    <div
      className={`h-screen relative w-16 sm:w-64 pt-14 flex flex-col duration-200 transition-all ${
        hideMenu ? '' : 'w-screen'
      }`}
    >
      <div className='flex flex-grow flex-col border-r border-gray-5 px-2'>
        <div className='mt-2'>
          <SideBarItem label={'Drive'} to='/drive' iconName='FolderIcon' hideLabel={hideMenu} />
          <SideBarItem label={'Shared Links'} to='#' iconName='ChainIcon' hideLabel={hideMenu} />
          <SideBarItem label={'Recents'} to='#' iconName='ClockIcon' hideLabel={hideMenu} />
          <SideBarItem label={'Trash'} to='/trash' iconName='TrashIcon' hideLabel={hideMenu} />
        </div>

        <div className='sm:hidden mt-8'>
          <SideBarItem label={'Setting'} to='#' iconName='GearIcon' hideLabel={hideMenu} />
        </div>

        <div className='mt-2 flex sm:hidden mt-2 pl-3'>
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

        <div className='mt-auto mb-11 md:px-5'>{((1024 ** 3 * 10 - 0) / 1024 ** 3) * 10} %</div>
      </div>
    </div>
  )
}

export default SideBar
