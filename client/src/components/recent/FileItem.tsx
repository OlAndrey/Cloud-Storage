import { FC } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import Icon from '../icon/Icon'
import { IRecentFile } from '../../types/file'
import { sizeFormat } from '../../utils/sizeFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

type FileItemPropTypes = {
  file: IRecentFile
}

const FileItem: FC<FileItemPropTypes> = ({ file }) => {
  return (
    <div className={'grid grid-cols-12 items-center gap-4 py-1.5 px-2 md:px-4'}>
      <div className='col-start-1'>
        <Icon
          name={file.type === 'dir' ? 'FolderIcon' : 'FileIcon'}
          size={[24, 24]}
          fill='#ffffff'
        />
      </div>
      <div className='col-start-3 md:col-start-2 col-end-6 md:col-end-5'>
        <Link to={`/drive/${file.type === 'dir' ? 'folders' : 'file'}/${file._id}`}>
          {file.name}
        </Link>
      </div>
      <div className='col-start-6 md:col-start-5 col-end-8'>{file.author.name}</div>
      <div className='col-start-8 col-end-11'>{dayjs(file.newlyOpened).format('ll')}</div>
      <div className='col-start-11'>{file.size ? sizeFormat(file.size) : '-'}</div>
    </div>
  )
}

export default FileItem
