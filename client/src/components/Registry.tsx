import { SubmitHandler, useForm } from 'react-hook-form'
import TextInput from './TextInput'
import PasswordInput from './PasswordInput'
import { IFormValues } from '../types/form'

const Registry = () => {

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
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight'>
          Registaration
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
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
                pattern={{ value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, message: 'Email is not valid' }}
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

          <div>
            <button
              type='submit'
              disabled={!isValid}
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Create account
            </button>
          </div>
        </form>

        <p className='mt-10 text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <a href='#' className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
            Log In
          </a>
        </p>
      </div>
    </div>
  )
}

export default Registry
