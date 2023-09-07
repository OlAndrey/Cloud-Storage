import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Modal from '../../../modal/Modal'
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux'
import { IFormValues } from '../../../../types/form'
import PasswordInput from '../../../inputs/PasswordInput'
import { editPassword } from '../../../../store/reducers/authSlice'
import Icon from '../../../icon/Icon'

const ChangePassword = () => {
  const { error } = useAppSelector((state) => state.auth)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    watch,
  } = useForm<IFormValues>({
    mode: 'onChange',
  })

  const onClose = () => setIsModalOpen(false)

  const onSubmit: SubmitHandler<IFormValues> = async (formData, e) => {
    e?.preventDefault()
    const { lastPassword, currentPassword, confirmPassword } = formData
    if (currentPassword.trim() && confirmPassword === currentPassword) {
      await dispatch(editPassword({ lastPassword: lastPassword, newPassword: currentPassword }))
      setIsModalOpen(false)
    }
  }

  return (
    <div>
      <h1 className='mb-3 text-lg font-medium'>Change Password</h1>
      <div className='rounded-lg border border-gray-10 p-5'>
        <p className='text-gray-60'>
          Be sure to remember the new password. If you lose it, you won&apos;t be able to access all
          your files. we I strongly recommend using a password manager.{' '}
        </p>
        <button
          className='mt-3 p-2 rounded-lg bg-blue-700 transition duration-150 ease-in-out hover:bg-blue-800'
          onClick={() => setIsModalOpen(true)}
        >
          Change password
        </button>
      </div>

      <Modal isOpen={isModalOpen} title='Change password' onClose={onClose}>
        <form className='space-y-6 px-2' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor='password' className='block text-sm font-medium leading-6'>
              Password
            </label>
            <div className='mt-2'>
              <PasswordInput
                placeholder={'Old password'}
                label='lastPassword'
                register={register}
                required={true}
                minLength={{ value: 1, message: 'Last Password must not be empty' }}
                error={errors.password}
              />
            </div>
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-medium leading-6'>
              New password
            </label>
            <div className='mt-2'>
              <PasswordInput
                placeholder={'New password'}
                label='currentPassword'
                register={register}
                required={true}
                minLength={{ value: 1, message: 'New password must not be empty' }}
                error={errors.password}
              />
            </div>
          </div>
          <div>
            <label htmlFor='confirmPassword' className='block text-sm font-medium leading-6'>
              Confirm new password
            </label>
            <div className='mt-2'>
              <PasswordInput
                placeholder={'Confirm new password'}
                label='confirmPassword'
                register={register}
                validate={(value: string) => {
                  if (watch('currentPassword') != value) {
                    return 'Your passwords do no match'
                  }
                }}
                required={true}
                minLength={{ value: 1, message: 'Confirm new password must not be empty' }}
                error={errors.password}
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
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Create
            </button>
          </div>
        </form>
        {error && (
          <div className='flex flex-row items-start pt-1'>
            <div className='flex h-5 flex-row items-center'>
              <Icon name='WarningIcon' fill='#EA580C' size={[20, 20]} className='mr-1' />
            </div>
            <span className='font-base w-56 text-sm text-orange-600'>{error}</span>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ChangePassword
