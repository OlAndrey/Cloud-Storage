import { useState } from 'react'
import Modal from '../../../modal/Modal'
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux'
import { deleteUser } from '../../../../store/reducers/authSlice'

const DeleteAccount = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const loading = useAppSelector(state => state.auth.loading)
  const dispatch = useAppDispatch()

  const onClose = () => setIsModalOpen(false)

  return (
    <div>
      <h1 className='mb-3 text-lg font-medium'>Delete Account</h1>
      <div className='rounded-lg border border-gray-10 p-5'>
        <p className='text-gray-400'>
          Once your account is deleted, your files and data will be permanently deleted. Once
          started, this action cannot be undone.
        </p>
        <button
          className='mt-3 p-2 rounded-lg bg-red-800 transition duration-250 ease-in-out hover:bg-red-600'
          onClick={() => setIsModalOpen(true)}
        >
          Delete account
        </button>
      </div>

      <Modal isOpen={isModalOpen} title='Delete Account' onClose={onClose}>
        <div className='p-2'>
          <p>Once your account is deleted, your files and data will be deleted.</p>
          <p>Are you sure you want to delete your account?</p>
          <div className='flex justify-end py-3'>
            <button
              className='bg-transparent border border-gray-300 hover:border-gray-400 text-gray-300 hover:text-gray-400 font-bold py-2 px-4 mr-3 rounded-l'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
            type='button'
              className='bg-red-700 hover:bg-red-500 disabled:bg-red-500/50 text-white font-bold py-2 px-4 rounded'
              disabled={loading}
              onClick={() => dispatch(deleteUser)}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DeleteAccount
