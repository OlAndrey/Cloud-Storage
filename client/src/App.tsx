import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Registry from './components/Registry'
import Header from './components/Header'

const App = () => {
  return (
    <div className='h-screen bg-default text-white'>
      <Header />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/registration' element={<Registry />} />
        <Route path='/*' element={<Navigate to='/login' replace={true} />} />
      </Routes>
    </div>
  )
}

export default App
