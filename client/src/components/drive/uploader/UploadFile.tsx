import { FC } from 'react'
import { useAppDispatch } from '../../../hooks/redux'
import { removeUploadFile } from '../../../store/reducers/uploadSlice'
import { IUploadFileProcess } from '../../../types/file'
import Icon from '../../icon/Icon'

type UploadFilePropsType = {
  file: IUploadFileProcess
}

const UploadFile: FC<UploadFilePropsType> = ({ file }) => {
  const dispatch = useAppDispatch()

  const handlerRemoveUploadFile = () => {
    file.closeUpload()
    dispatch(removeUploadFile(file.id))
  }

  return (
    <div className='py-1'>
      <div className='flex justify-between align-center'>
        {file.progress === 100 && (
          <div className='pr-1.5'>
            <Icon name='FileIcon' size={[24, 24]} fill='#ffffff' />
          </div>
        )}
        <div className='flex-grow truncate'>{file.name}</div>
        <button
          type='button'
          className='p-1 bg-transparent text-gray-400 transition duration-150 ease-in-out hover:text-white'
          onClick={handlerRemoveUploadFile}
        >
          <Icon name='CloseIcon' size={[14, 14]} />
        </button>
      </div>
      {file.progress !== 100 && (
        <div className='w-full bg-gray-200 rounded-full h-2 my-1.5 dark:bg-gray-700'>
          <div
            className='bg-gray-600 h-2 rounded-full dark:bg-gray-300'
            style={{ width: file.progress + '%' }}
          ></div>
        </div>
      )}
    </div>
  )
}

export default UploadFile
