import SideBarItem from './SideBarItem'

const SideBar = () => {
  return (
    <div className='h-[calc(100vh-3.5rem)] flex w-64 flex-col'>
      <div className='flex flex-grow flex-col justify-between border-r border-gray-5 px-2'>
        <div className='mt-2'>
          <SideBarItem label={'Drive'} to='#' iconName='FolderIcon' />
          <SideBarItem label={'Shared Links'} to='#' iconName='ChainIcon' />
          <SideBarItem label={'Recents'} to='#' iconName='ClockIcon' />
          <SideBarItem label={'Trash'} to='#' iconName='TrashIcon' />
        </div>

        <div className='mt-8 mb-11 px-5'>0 - {1024 ** 3 * 10}</div>
      </div>
    </div>
  )
}

export default SideBar
