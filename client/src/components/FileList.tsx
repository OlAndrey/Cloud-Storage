import FileView from './FileView'

const FileList = () => {
  return (
    <div className='pt-14 px-2 md:px-4'>
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-start-1'>Type</div>
        <div className='col-start-3 md:col-start-2'>Name</div>
        <div className='col-start-7'>Modified</div>
        <div className='col-start-11'>Size</div>
      </div>
      <FileView
        file={{
          name: 'Personal',
          type: 'dir',
          modified: new Date(),
          created: new Date(),
          accessLink: '',
        }}
      />
      <FileView
        file={{
          name: 'test.js',
          type: 'file',
          size: 2000,
          modified: new Date(),
          created: new Date(),
          accessLink: '',
        }}
      />
    </div>
  )
}

export default FileList
