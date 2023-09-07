import { ReactNode } from 'react'
import Icon from '../icon/Icon'

type ModalPropTypes = {
  isOpen: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

function Modal({ isOpen, children, title, onClose }: ModalPropTypes) {
  return (
    <div
      style={{ display: isOpen ? 'flex' : 'none' }}
      className='absolute top-0 left-0 h-screen w-screen flex-col justify-center items-center bg-black/50'
    >
      <div className='w-full relative px-2 sm:mx-auto sm:max-w-md rounded-lg shadow bg-default'>
        <div className='flex justify-between p-2'>
          <h3 className='text-xl'>{title}</h3>
          <button
            type='button'
            className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 hover:bg-gray-800 hover:text-white'
            onClick={onClose}
          >
            <Icon name='CloseIcon' size={[24, 24]} />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}

export default Modal
