import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import TextInput from '../inputs/TextInput'
import PasswordInput from '../inputs/PasswordInput'
import { IFormValues } from '../../types/form'
import Icon from '../icon/Icon'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { resetError } from '../../store/reducers/authSlice'
import { loginUser } from '../../store/actions/authActions'
import Container from './AuthContainer'

const Login = () => {
  const { loading, info, error } = useAppSelector((state) => state.auth)
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

  const onSubmit: SubmitHandler<IFormValues> = async (formData, e) => {
    e?.preventDefault()
    const { email, password } = formData

    dispatch(loginUser({ email, password }))
  }

  return (
    <Container title='Log In'>
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
            <div className='flex items-center justify-between'>
              <label htmlFor='password' className='block text-sm font-medium leading-6'>
                Password
              </label>
              <div className='text-sm'>
                <Link
                  to='/recovery-link'
                  className='font-semibold text-indigo-600 hover:text-indigo-500'
                >
                  Forgot password?
                </Link>
              </div>
            </div>
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

          {info && (
            <div className='flex flex-row items-start pt-1'>
              <div className='flex h-5 flex-row items-center'>
                <Icon name='SuccessIcon' fill='#16A34A' size={[20, 20]} className='mr-1' />
              </div>
              <span className='font-base w-56 text-sm text-green-600'>{info}</span>
            </div>
          )}

          <div>
            <button
              type='submit'
              disabled={!isValid || loading}
              className='flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-zinc-400'
            >
              {loading && <Icon className='animate-spin mr-3' size={[16, 16]} name='SpinnerIcon' />}
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
    </Container>
  )
}

export default Login
