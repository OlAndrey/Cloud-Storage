import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import Icon from './Icon'

interface SidenavItemProps {
  label: string
  to: string
  iconName: string
}

const SideBarItem = ({ label, to, iconName }: SidenavItemProps): JSX.Element => {
  const isActive = Math.random() * 4 <= 1

  const content: ReactNode = (
    <div className='flex h-10 w-full items-center justify-between'>
      <div className='flex items-center'>
        <Icon name={iconName} size={[24, 24]} fill={isActive ? '#3B82F6' : '#ffffff'} />
        <span className='ml-2'>{label}</span>
      </div>
    </div>
  )

  return (
    <div
      className={`cursor-pointer rounded-lg pl-6 pr-3 mb-1 font-medium ${
        isActive ? 'bg-blue-500 bg-opacity-10' : 'hover:bg-blue-500 hover:bg-opacity-10'
      }`}
    >
      <NavLink
        className={`no-underline ${
          isActive ? 'text-blue-500' : ''
        }`}
        to={to}
      >
        {content}
      </NavLink>
    </div>
  )
}

export default SideBarItem
