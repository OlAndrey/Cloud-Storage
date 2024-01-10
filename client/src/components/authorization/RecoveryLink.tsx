import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import Container from './AuthContainer'
import TextInput from '../inputs/TextInput'
import Icon from '../icon/Icon'
import { IFormValues } from '../../types/form'
import axios from '../../utils/axios'

const RecoveryLink = () => {
  const [loading, setLoading] = useState(false)
  const [emailErrors, setEmailErrors] = useState('')
  const [step, setStep] = useState(1)

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IFormValues>({
    mode: 'onChange',
  })

  const onSendEmail: SubmitHandler<IFormValues> = async (formData, e) => {
    e?.preventDefault()
    const { email } = formData

    if (!errors.email) {
      try {
        setLoading(true)
        const data = await axios.post('/api/auth/reset-password', { email })
        if (data) setEmailErrors('')
        setStep(2)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response && error.response.data.message)
          return setEmailErrors(error.response.data.message)
        return setEmailErrors(error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Container title='Account recovery'>
      {step === 1 ? (
        <div className='mt-10'>
          <form className='space-y-6' onSubmit={handleSubmit(onSendEmail)}>
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

            {emailErrors && (
              <div className='flex flex-row items-start pt-1'>
                <div className='flex h-5 flex-row items-center'>
                  <Icon name='WarningIcon' fill='#EA580C' size={[20, 20]} className='mr-1' />
                </div>
                <span className='font-base w-56 text-sm text-orange-600'>{emailErrors}</span>
              </div>
            )}

            <button
              type='submit'
              disabled={!isValid || loading}
              className='flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 disabled:bg-zinc-400'
            >
              {loading && <Icon className='animate-spin mr-3' size={[16, 16]} name='SpinnerIcon' />}
              Forgot Password
            </button>
          </form>

          <div className='flex w-full justify-center mt-8 font-medium'>
            <span>Remember your password? </span>
            <Link to='/login' className='font-semibold text-indigo-600 hover:text-indigo-500'>
              Login
            </Link>
          </div>
        </div>
      ) : (
        <div className='flex w-full flex-col items-center justify-center space-y-5 p-8 text-center'>
          <div className='flex flex-col items-center space-y-4'>
            <Icon size={[24, 24]} fill='#ffffff' name='SuccessIcon' />
            <p className='font-regular text-base'>
              An email has been sent to your email with instructions to restore access to your
              account.
            </p>
          </div>
        </div>
      )}
    </Container>
  )
}

export default RecoveryLink
