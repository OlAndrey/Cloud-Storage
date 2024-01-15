import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import TextInput from '../../../inputs/TextInput'
import { IFormValues } from '../../../../types/form'
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux'
import { editName } from '../../../../store/actions/authActions'
import Modal from '../../../modal/Modal'

const AccountDetails = () => {
  const { userInfo } = useAppSelector((state) => state.auth)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormValues>({
    defaultValues: {
      name: userInfo ? userInfo.name : '',
      email: userInfo ? userInfo.email : '',
    },
    mode: 'onChange',
  })

  const onClose = () => setIsModalOpen(false)

  const onSubmit: SubmitHandler<IFormValues> = async (formData, e) => {
    e?.preventDefault()
    const { name } = formData
    if (name.trim()) dispatch(editName({ name }))
  }

  return (
    <div>
      <h1 className='mb-3 text-lg font-medium'>Account Details</h1>
      <div className='rounded-lg border border-gray-10 p-5'>
        <div className='flex justify-between'>
          <div className='flex min-w-0'>
            <div className='min-w-0'>
              <h2 className='truncate text-sm'>Full Name</h2>
              <h1 className='truncate text-lg font-medium'>{userInfo?.name}</h1>
            </div>
          </div>
          <button
            className='flex-shrink-0 rounded-lg border border-gray-10 px-3 transition duration-150 ease-in-out hover:border-gray-400 hover:text-gray-400 '
            onClick={() => setIsModalOpen(true)}
          >
            Edit
          </button>
        </div>
        <div className='mt-5 flex items-center justify-between'>
          <div>
            <div className='min-w-0'>
              <h2 className='truncate text-sm'>Email</h2>
              <h1 className='truncate text-lg font-medium'>{userInfo?.email}</h1>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} title='Edit Account Details' onClose={onClose}>
        <form className='space-y-6 px-2' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor='name' className='block text-sm font-medium leading-6'>
              <span>Your name</span>
            </label>
            <div className='mt-2'>
              <TextInput
                placeholder='Enter name...'
                label='name'
                type='text'
                register={register}
                minLength={{ value: 1, message: 'Name must not be empty' }}
                error={errors.name}
              />
            </div>
          </div>
          <div>
            <label htmlFor='email' className='block text-sm font-medium leading-6'>
              <span>Email address</span>
            </label>
            <div className='mt-2'>
              <TextInput
                placeholder='Enter name...'
                label='email'
                type='text'
                register={register}
                disabled={true}
                error={errors.email}
              />
            </div>
          </div>
          <div className='flex justify-end py-3'>
            <button
              className='bg-transparent border border-gray-300 hover:border-gray-400 text-gray-300 hover:text-gray-400 font-bold py-2 px-4 mr-3 rounded-l'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={!isValid}
              className='bg-blue-500 disabled:bg-gray-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Change
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AccountDetails
