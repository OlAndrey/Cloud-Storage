import { useNavigate } from 'react-router-dom'
import Icon from '../icon/Icon'

const Cancel = () => {
  const navigate = useNavigate()

  return (
    <div className='m-0 p-0'>
      <div className='w-screen pt-14 pl-16 sm:pl-48 lg:pl-64 min-h-[80vh] flex flex-col justify-center items-center'>
        <div className='my-10 text-2xl mx-auto flex flex-col justify-center items-center'>
          <Icon size={[64, 64]} fill='#fb923c' name='WarningIcon' />
          <h3 className='text-4xl pt-20 lg:pt-0 font-bold text-center text-orange-400'>Something Went Wrong</h3>
          <button
            onClick={() => navigate('/')}
            className='w-auto uppercase text-xl my-16 px-8 py-3 rounded-lg border border-gray-10 px-3 transition duration-150 ease-in-out hover:border-gray-400 hover:text-gray-400 '
          >
            Go To Homepage
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cancel
