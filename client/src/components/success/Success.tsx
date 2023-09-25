import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/redux'
import { changeUserInfo } from '../../store/reducers/authSlice'
import { handlePaymentSuccess } from '../../payment/services'
import Icon from '../icon/Icon'

const Success = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handler = async () => {
    setLoading(true)
    const data = await handlePaymentSuccess()
    if (typeof data !== 'string') dispatch(changeUserInfo(data))
    else setError(data)
    setLoading(false)
  }

  useEffect(() => {
    handler()
  }, [])

  return (
    <div className='m-0 p-0'>
      <div className='w-screen pt-14 pl-16 sm:pl-48 lg:pl-64 min-h-[80vh] flex flex-col justify-center items-center'>
        {loading ? (
          <Icon className='animate-spin mr-3' size={[64, 64]} fill='#ffffff' name='SpinnerIcon' />
        ) : (
          <div className='my-10 text-2xl mx-auto flex flex-col justify-center items-center'>
            {error ? (
              <Icon size={[64, 64]} fill='#bb2124' name='WarningIcon' />
            ) : (
              <Icon size={[64, 64]} fill='#22bb33' name='SuccessIcon' />
            )}

            <h3 className={`text-4xl pt-20 lg:pt-0 font-bold text-center ${error ? 'text-[#bb2124]' :'text-[#22bb33]'}`}>
              {error ? error : 'Payment Successful'}
            </h3>
            <button
              onClick={() => navigate('/')}
              className='w-auto uppercase text-xl my-16 px-8 py-3 rounded-lg border border-gray-10 px-3 transition duration-150 ease-in-out hover:border-gray-400 hover:text-gray-400 '
            >
              Go To Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Success
