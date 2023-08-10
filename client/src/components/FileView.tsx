import { IFile } from '../types/file'
import Icon from './Icon'

const FileView = ({ file }: { file: IFile }) => {
  return (
    <div className='py-2 grid grid-cols-12 items-center gap-4'>
      <div className='col-start-1'>
        <Icon name={file.type === 'dir' ? 'FolderIcon' : 'FileIcon'} size={[24, 24]} fill='#ffffff' />
      </div>
      <div className='col-start-3 md:col-start-2'>{file.name}</div>
      <div className='col-start-7 col-end-11'>
        {new Date(file.modified).toUTCString().slice(0, 10)}
      </div>
      <div className='col-start-11'>{file.size ? file.size : '-'}</div>
    </div>
  )
}

export default FileView
