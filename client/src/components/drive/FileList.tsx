import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import FileView from './FileView'
import { setPopupDisplay, uploadFile } from '../../store/reducers/fileSlice'
import Icon from '../icon/Icon'
import Popup from './PopUp'

const FileList = () => {
  const { isOwnFolder, currentDir, files, dirStack } = useAppSelector((state) => state.drive)
  const dispatch = useAppDispatch()

  const handlerCreateDir = () => {
    dispatch(setPopupDisplay('flex'))
  }

  const handlerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) {
      const files = [...e.target.files]
      files.forEach((file) => dispatch(uploadFile({ file, dirId: currentDir })))
    }
  }

  return (
    <>
      {isOwnFolder ? (
        <div className='pt-3 px-2 md:px-4 flex justify-between items-center'>
          <div className='flex flex-wrap flex-grow'>
            {dirStack.map((parent, ind, stack) => (
              <div key={ind} className='pr-2 sm:px-2 text-base sm:text-xl'>
                {ind !== stack.length - 1 ? (
                  <Link
                    to={`/drive/${parent.id ? 'folders/' + parent.id : ''}`}
                    className='hover:text-blue-500'
                  >
                    {parent.name}&nbsp;&#47;&nbsp;
                  </Link>
                ) : (
                  <div className='font-semibold'>{parent.name}</div>
                )}
              </div>
            ))}
          </div>
          <label
            htmlFor='upload-input'
            className='flex items-center rounded-xl bg-blue-700 mx-2 px-2 py-1 sm:px-4 sm:py-1.5 text-md transition duration-150 ease-in-out hover:bg-blue-800'
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
          <div onClick={() => handlerCreateDir()}>
            <Icon name='FolderPlusIcon' fill='#ffffff' size={[32, 32]} />
          </div>
        </div>
      ) : (
        ''
      )}
      <div className='pt-3 px-2 md:px-4 grid grid-cols-12 gap-4'>
        <div className='col-start-1'>Type</div>
        <div className='col-start-3 md:col-start-2'>Name</div>
        <div className='col-start-7'>Modified</div>
        <div className='col-start-11'>Size</div>
      </div>
      {files.length ? (
        files.map((file, index) => <FileView file={file} key={index} />)
      ) : (
        <div className='pt-3 px-2 md:px-4 text-center'>The folder is empty!</div>
      )}

      <Popup />
    </>
  )
}

export default FileList
