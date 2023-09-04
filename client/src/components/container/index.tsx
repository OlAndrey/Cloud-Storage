import { FC, ReactNode } from 'react'
import ComponentInCenter from '../componentInCenter'
import Icon from '../icon/Icon'
import SideBar from '../menu/SideBar'

type ContainerPropTypes = {
  error: string
  loading: boolean
  children: ReactNode
}

const Container: FC<ContainerPropTypes> = ({ children, error, loading }) => {
  return (
    <div className='w-screen flex'>
      <SideBar />
      <div className='w-full pt-14 grow'>
        {error ? (
          <ComponentInCenter>{error}</ComponentInCenter>
        ) : loading ? (
          <ComponentInCenter>
            <Icon className='animate-spin mr-3' size={[64, 64]} fill='#ffffff' name='SpinnerIcon' />
          </ComponentInCenter>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default Container
