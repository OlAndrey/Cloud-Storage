import { useState } from 'react'
import { createDir, setPopupDisplay } from '../store/reducers/fileSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import Icon from './Icon'

const Popup = () => {
  const [dirName, setDirName] = useState('Untitled')
  const popupDisplay = useAppSelector((state) => state.drive.popUpDisplay)
  const currentDir = useAppSelector((state) => state.drive.currentDir)
  const dispatch = useAppDispatch()

  function createHandler() {
    dispatch(createDir({ name: dirName, parent: currentDir }))
    dispatch(setPopupDisplay('none'))
  }

  return (
    <div
      style={{ display: popupDisplay }}
      className='absolute top-0 left-0 h-screen w-screen flex-col justify-center items-center bg-black/50'
    >
      <div className='w-full relative px-2 sm:mx-auto sm:max-w-md bg-white rounded-lg shadow bg-default'>
        <div className='flex justify-between p-2'>
          <h3 className='text-xl'>New Folder</h3>
          <button
            type='button'
            className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 hover:bg-gray-800 hover:text-white'
            onClick={() => dispatch(setPopupDisplay('none'))}
          >
            <Icon name='CloseIcon' size={[24, 24]} />
          </button>
        </div>

        <input
          type='text'
          placeholder='Enter name...'
          className='block h-11 w-[calc(100%-1em)] mx-auto my-3 py-2 pl-2 rounded-lg border-2 bg-zinc-900 duration-100'
          value={dirName}
          onChange={(e) => setDirName(e.target.value)}
        />
        <div className='flex justify-end py-3'>
          <button
            className='bg-transparent border border-gray-300 hover:border-gray-400 text-gray-300 hover:text-gray-400 font-bold py-2 px-4 mr-3 rounded-l'
            onClick={() => dispatch(setPopupDisplay('none'))}
          >
            Cancel
          </button>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={() => createHandler()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default Popup
