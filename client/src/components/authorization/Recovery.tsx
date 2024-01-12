import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IFormValues } from '../../types/form'
import Icon from '../icon/Icon'
import Container from './AuthContainer'
import PasswordInput from '../inputs/PasswordInput'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { recoveryPassword } from '../../store/actions/authActions'

const Recovery = () => {
  const { loading, error } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    watch,
  } = useForm<IFormValues>({
    mode: 'onChange',
  })

  useEffect(() => {
    if (!id) navigate('/login')
  }, [id])

  const onSubmit: SubmitHandler<IFormValues> = async (formData, e) => {
    e?.preventDefault()
    const { currentPassword } = formData

    if (id) dispatch(recoveryPassword({ id, password: currentPassword }))
  }

  return (
    <Container title='Reset password'>
      <form className='space-y-6 px-2' onSubmit={handleSubmit(onSubmit)}>
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

        {error && (
          <div className='flex flex-row items-start pt-1'>
            <div className='flex h-5 flex-row items-center'>
              <Icon name='WarningIcon' fill='#EA580C' size={[20, 20]} className='mr-1' />
            </div>
            <span className='font-base w-56 text-sm text-orange-600'>{error}</span>
          </div>
        )}

        <button
          type='submit'
          disabled={!isValid || loading}
          className='flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-zinc-400'
        >
          {loading && <Icon className='animate-spin mr-3' size={[16, 16]} name='SpinnerIcon' />}
          Reset Password
        </button>
      </form>
    </Container>
  )
}

export default Recovery
