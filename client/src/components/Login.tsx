import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import TextInput from './TextInput'
import PasswordInput from './PasswordInput'
import { IFormValues } from '../types/form'
import Icon from './Icon'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { loginUser, resetError } from '../store/reducers/authSlice'

const Login = () => {
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
    const { email, password } = formData

    console.log(formData)
    dispatch(loginUser({ email, password }))
  }

  return (
    <div className='h-full container mx-auto px-4'>
      <div className='flex min-h-full flex-col justify-center items-center'>
        <div className='w-full sm:mx-auto sm:max-w-lg bg-zinc-900 rounded-2xl p-6 sm:px-11 sm:py-14'>
          <h2 className='text-center text-2xl font-bold leading-9 tracking-tight'>Log In</h2>

          <div className='mt-10'>
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor='email' className='block text-sm font-medium leading-6'>
                  <span>Email address</span>
                </label>
                <div className='mt-2'>
                  <TextInput
                    placeholder='email'
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
                    minLength={{ value: 1, message: 'Password must not be empty' }}
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
              Don&apos;t have an account?{' '}
              <Link
                to='/registration'
                className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
