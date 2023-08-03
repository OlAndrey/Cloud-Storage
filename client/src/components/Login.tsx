import { SubmitHandler, useForm } from 'react-hook-form'
import TextInput from './TextInput'
import PasswordInput from './PasswordInput'
import { IFormValues } from '../types/form'

const Login = () => {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormValues>({
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<IFormValues> = async (formData, e) => {
    e?.preventDefault()
    console.log(formData)
  }

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight'>Log In</h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
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
                pattern={{ value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Email is not valid' }}
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
                <a href='#' className='font-semibold text-indigo-600 hover:text-indigo-500'>
                  Forgot password?
                </a>
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

          <div>
            <button
              type='submit'
              disabled={!isValid}
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Sign in
            </button>
          </div>
        </form>

        <p className='mt-10 text-center text-sm text-gray-500'>
          Don&apos;t have an account?{' '}
          <a href='#' className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
            Create account
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
