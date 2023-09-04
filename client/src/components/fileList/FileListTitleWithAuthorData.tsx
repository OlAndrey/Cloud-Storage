const FileListTitle = () => {
  return (
    <div className='pt-3 px-2 md:px-4 grid grid-cols-12 gap-4'>
      <div className='col-start-1'>Type</div>
      <div className='col-start-3 md:col-start-2'>Name</div>
      <div className='col-start-6 md:col-start-5 col-end-8'>Owner</div>
      <div className='col-start-8 col-end-11'>Shared date</div>
      <div className='col-start-11'>Size</div>
    </div>
  )
}

export default FileListTitle
