import { FC, KeyboardEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { IDir, IFile } from '../../types/file'
import Icon from '../icon/Icon'
import { sizeFormat } from '../../utils/sizeFormat'

type FileViewPropTypes = {
  handlerEditName: (editFile: IDir) => void
  handlerSelect: (fileId: string) => void
  file: IFile
  isSelected: boolean
  isEdited: boolean
}

const FileView: FC<FileViewPropTypes> = ({
  isSelected,
  isEdited,
  file,
  handlerSelect,
  handlerEditName,
}) => {
  const fileType = file.name.includes('.')
    ? '.' + file.name.split('.')[file.name.split('.').length - 1]
    : ''
  const initName = file.name.replace(fileType, '')
  const [name, setName] = useState(initName)

  const handlerEdit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 || event.key === 'Enter') {
      const newName = name + fileType
      if (newName !== file.name)
        handlerEditName({
          id: file._id,
          name: newName,
        })
    }
  }

  return (
    <div
      className={`grid grid-cols-12 items-center gap-4 py-1.5 px-2 md:px-4 hover:px-0 hover:md:px-2 duration-200 transition-all cursor-pointer ${
        isSelected ? 'bg-blue-500/25' : ''
      }`}
      onClick={() => handlerSelect(file._id)}
    >
      <div className='col-start-1'>
        <Icon
          name={file.type === 'dir' ? 'FolderIcon' : 'FileIcon'}
          size={[24, 24]}
          fill='#ffffff'
        />
      </div>
      <div className='col-start-3 md:col-start-2 col-end-7'>
        {isEdited ? (
          <div className='w-34 max-w-full'>
            <input
              className='text-white border-2 bg-zinc-900 focus:border-zinc-400'
              onKeyDown={handlerEdit}
              onChange={(e) => setName(e.target.value)}
              value={name}
              autoFocus
            />
            {fileType}
          </div>
        ) : (
          <Link to={`/drive/folders/${file._id}`}>{file.name}</Link>
        )}
      </div>
      <div className='col-start-7 col-end-11'>{file.updatedAt.slice(0, 10)}</div>
      <div className='col-start-11'>{file.size ? sizeFormat(file.size) : '-'}</div>
    </div>
  )
}

export default FileView
