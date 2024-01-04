import { ChangeEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux'
import { changeAvatar } from '../../../../store/actions/authActions'
import PictureAvatar from '../../../image/PictureAvatar'

const UserHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { userInfo } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const handlerFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) {
      const file = e.target.files[0]
      dispatch(changeAvatar(file))
    }
  }

  return (
    <div className='relative py-3'>
      <div className='h-28' onClick={() => setIsModalOpen(false)}></div>
      <div
        className='absolute top-0 inset-x-1/2 -ml-14 w-28 cursor-pointer'
        onClick={() => setIsModalOpen(true)}
      >
        <PictureAvatar src={`${process.env.REACT_APP_API_URL}/${userInfo?.avatarUrl}`} diameter={110} />
      </div>

      <div
        className={`z-10 absolute top-20 left-1/2 py-2 ${
          isModalOpen ? 'block' : 'hidden'
        } rounded-lg shadow w-34 bg-gray-700`}
      >
        <label
          htmlFor='upload-avatar'
          className='text-sm text-gray-400 cursor-pointer transition duration-150 ease-in-out hover:text-white'
        >
          <span className='px-4'>Edit avatar</span>
          <input
            type='file'
            accept='image/png, image/jpeg'
            onChange={handlerFileUpload}
            id='upload-avatar'
            className='hidden'
          />
        </label>
      </div>
      <h1 className='truncate text-lg font-medium'>{userInfo?.name}</h1>
      <h2 className='truncate text-sm text-center text-gray-400'>{userInfo?.email}</h2>
    </div>
  )
}

export default UserHeader
