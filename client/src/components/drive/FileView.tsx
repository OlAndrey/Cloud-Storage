import { FC } from 'react'
import { Link } from 'react-router-dom'
import { IFile } from '../../types/file'
import Icon from '../icon/Icon'

type FileViewPropTypes = {
  handlerSelect: (fileId: string) => void
  file: IFile
  isSelected: boolean
}

const FileView: FC<FileViewPropTypes> = ({ isSelected, file, handlerSelect }) => {
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
        <Link to={`/drive/folders/${file._id}`}>{file.name}</Link>
      </div>
      <div className='col-start-7 col-end-11'>{file.updatedAt.slice(0, 10)}</div>
      <div className='col-start-11'>{file.size ? file.size : '-'}</div>
    </div>
  )
}

export default FileView
