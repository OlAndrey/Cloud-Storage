import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Registry from './components/Registry'

const App = () => {
  return (
    <div className='h-screen bg-default text-white'>
      <div className='h-full container mx-auto px-4'>
        <div className='flex min-h-full flex-col justify-center items-center'>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Registry />} />
            <Route path='/*' element={<Navigate to='/login' replace={true} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
