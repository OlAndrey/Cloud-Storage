import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { hideUploader } from '../../../store/reducers/uploadSlice'
import Icon from '../../icon/Icon'
import UploadFile from './UploadFile'

const Uploader = () => {
  const { files, isVisible } = useAppSelector((state) => state.upload)
  const dispatch = useAppDispatch()

  return isVisible ? (
    <div className='w-full sm:w-72 rounded-xl border-2 border-gray-500 fixed bottom-1 right-1'>
      <div className='p-2 flex justify-between rounded-t-xl border-b-2 border-gray-500 bg-gray-700'>
        <div>
          {files.find((file) => file.progress !== 100)
            ? 'Uploading files...'
            : 'All processes have finished'}
        </div>
        <button
          type='button'
          className='p-1 bg-transparent hover:bg-gray-800 transition duration-150 ease-in-out hover:text-gray-400'
          onClick={() => dispatch(hideUploader())}
        >
          <Icon name='CloseIcon' size={[18, 18]} />
        </button>
      </div>
      <div className='h-48 px-2 overflow-y-auto'>
        {files.map((file, ind) => (
          <UploadFile key={file.id + ind} file={file} />
        ))}
      </div>
    </div>
  ) : (
    <div className=''></div>
  )
}

export default Uploader
