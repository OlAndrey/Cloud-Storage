const FileListTitle = () => {
  return (
    <div className='pt-3 px-2 md:px-4 grid grid-cols-12 gap-4'>
      <div className='col-start-1'>Type</div>
      <div className='col-start-3 md:col-start-2'>Name</div>
      <div className='col-start-7'>Modified</div>
      <div className='col-start-11'>Size</div>
    </div>
  )
}

export default FileListTitle
