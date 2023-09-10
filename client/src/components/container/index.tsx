import { FC, ReactNode } from 'react'
import ComponentInCenter from '../componentInCenter'
import Icon from '../icon/Icon'

type ContainerPropTypes = {
  error: string
  loading: boolean
  children: ReactNode
}

const Container: FC<ContainerPropTypes> = ({ children, error, loading }) => {
  return (
    <div className='w-screen pt-14 pl-16 sm:pl-48 lg:pl-64'>
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
  )
}

export default Container
