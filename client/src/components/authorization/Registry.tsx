import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import TextInput from '../inputs/TextInput'
import PasswordInput from '../inputs/PasswordInput'
import { IFormValues } from '../../types/form'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import Icon from '../icon/Icon'
import { registerUser, resetError } from '../../store/reducers/authSlice'
import Container from './AuthContainer'

const Registry = () => {
  const { loading, userToken, error } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormValues>({
    mode: 'onChange',
  })

  useEffect(() => {
    if (error) dispatch(resetError())
  }, [])

  useEffect(() => {
    if (userToken) console.log('Successfully')
  }, [userToken])

  const onSubmit: SubmitHandler<IFormValues> = async (formData, e) => {
    e?.preventDefault()
    const { email, password, name } = formData
    dispatch(registerUser({ email, password, name }))
  }

  return (
    <Container title='Registration'>

          <div className='mt-10'>
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor='name' className='block text-sm font-medium leading-6'>
                  <span>Your name</span>
                </label>
                <div className='mt-2'>
                  <TextInput
                    placeholder='Name'
                    label='name'
                    type='text'
                    register={register}
                    minLength={{ value: 1, message: 'Email must not be empty' }}
                    error={errors.email}
                  />
                </div>
              </div>
              <div>
                <label htmlFor='email' className='block text-sm font-medium leading-6'>
                  <span>Email address</span>
                </label>
                <div className='mt-2'>
                  <TextInput
                    placeholder='Email'
                    label='email'
                    type='email'
                    register={register}
                    pattern={{
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: 'Email is not valid',
                    }}
                    minLength={{ value: 1, message: 'Email must not be empty' }}
                    error={errors.email}
                  />
                </div>
              </div>

              <div>
                <label htmlFor='password' className='block text-sm font-medium leading-6'>
                  Password
                </label>
                <div className='mt-2'>
                  <PasswordInput
                    placeholder={'Password'}
                    label='password'
                    register={register}
                    required={true}
                    minLength={{ value: 8, message: 'Password should be at-least 8 characters.' }}
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

              <div>
                <button
                  type='submit'
                  disabled={!isValid || loading}
                  className='flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-zinc-400'
                >
                  {loading && (
                    <Icon className='animate-spin mr-3' size={[16, 16]} name='SpinnerIcon' />
                  )}
                  Sign in
                </button>
              </div>
            </form>

            <p className='mt-10 text-center text-sm text-gray-500'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
              >
                Log In
              </Link>
            </p>
          </div>
        </Container>
  )
}

export default Registry
