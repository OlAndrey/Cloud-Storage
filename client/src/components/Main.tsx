import FileList from './FileList'
import SideBar from './SideBar'

const Main = () => {
  return (
    <div className='w-screen flex'>
      <SideBar />
      <FileList />
    </div>
  )
}

export default Main
