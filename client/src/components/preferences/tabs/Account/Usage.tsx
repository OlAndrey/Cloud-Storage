import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../../hooks/redux'
import { sizeFormat } from '../../../../utils/sizeFormat'

const Usage = () => {
  const navigate = useNavigate()
  const { userInfo } = useAppSelector((state) => state.auth)

  const percent = userInfo
    ? Math.round(
        ((userInfo.diskSpace - (userInfo.diskSpace - userInfo.usedSpace)) / userInfo.diskSpace) *
          100,
      )
    : 0

  return (
    <div>
      <h1 className='mb-3 text-lg font-medium'>Usage</h1>
      <div className='rounded-lg border p-5'>
        <div className='flex justify-between items-center'>
          <div className='rounded-lg border-2 p-2 font-medium border-blue-500 text-blue-500'>
            {sizeFormat(userInfo?.diskSpace as number)}
          </div>
          <div className='pl-2 grow'>Free plan</div>
          <button
            className='p-2 rounded-lg bg-blue-700 transition duration-150 ease-in-out hover:bg-blue-800'
            onClick={() => navigate('?tab=plans')}
          >
            Upgrade
          </button>
        </div>
        <div className='flex justify-between items-center mt-3'>
          <div className=''>
            Used&nbsp;
            {sizeFormat(userInfo?.usedSpace as number) +
              ' of ' +
              sizeFormat(userInfo?.diskSpace as number)}
          </div>
          <div className=''>{percent + '%'}</div>
        </div>
        <div className='w-full bg-gray-200 rounded-full mt-2 h-2.5 dark:bg-gray-700'>
          <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: percent + '%' }}></div>
        </div>
      </div>
    </div>
  )
}

export default Usage
