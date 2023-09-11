import { FC, ReactNode } from 'react'

type ComponentInCenterPropsType = {
    children: ReactNode | string
}

const ComponentInCenter: FC<ComponentInCenterPropsType> = ({children}) => {
  return (
    <div className='h-full flex items-center'>
      <div className='w-full sm:m-0 flex justify-center items-center font-medium text-lg'>
        {children}
      </div>
    </div>
  )
}

export default ComponentInCenter
