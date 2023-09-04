import { ChangeEvent, FC } from 'react'
import Icon from '../icon/Icon'

type UploadButtonPropType = {
  uploadFile: (file: File) => void
}

const UploadButton: FC<UploadButtonPropType> = ({ uploadFile }) => {
  const handlerFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) {
      const files = [...e.target.files]
      files.forEach((file) => uploadFile(file))
    }
  }

  return (
    <label
      htmlFor='upload-input'
      className='flex items-center rounded-xl bg-blue-700 mx-2 px-2 py-1 sm:px-4 sm:py-1.5 text-md cursor-pointer transition duration-150 ease-in-out hover:bg-blue-800'
    >
      <Icon name='UploadIcon' fill='#ffffff' size={[24, 24]} />
      <span className='hidden ml-2 sm:inline'>Upload Files</span>
      <input
        type='file'
        multiple={true}
        onChange={handlerFileUpload}
        id='upload-input'
        className='hidden'
      />
    </label>
  )
}

export default UploadButton
