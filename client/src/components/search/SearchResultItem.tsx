import { FC } from 'react'
import dayjs from 'dayjs'
import { IFile } from '../../types/file'
import Icon from '../icon/Icon'

type SearchResultItemPropsType = {
  file: IFile
  navigate: (to: string) => void
}

const SearchResultItem: FC<SearchResultItemPropsType> = ({ file, navigate }) => {

  return (
    <li
      className='flex py-1 px-2 cursor-pointer'
      onClick={() => navigate(`/drive/${file.type === 'dir' ? 'folders' : 'file'}/${file._id}`)}
    >
      <div className='pr-2'>
        <Icon
          name={file.type === 'dir' ? 'FolderIcon' : 'FileIcon'}
          size={[24, 24]}
          fill='#ffffff'
        />
      </div>
      <div className='grow truncate'>{file.name}</div>
      <div className='pl-2'>{dayjs(file.updatedAt).format('DD/MM/YYYY')}</div>
    </li>
  )
}

export default SearchResultItem
