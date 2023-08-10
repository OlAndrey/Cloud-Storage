import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Registry from './components/Registry'
import Main from './components/Main'
import Header from './components/Header'
import { useAppDispatch, useAppSelector } from './hooks/redux'
import { authCheckThunk, authChecked } from './store/reducers/authSlice'
import Icon from './components/Icon'

const App = () => {
  const { authCheck, userInfo } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!authCheck) {
      const userToken = window.localStorage.getItem('userToken')
      if (userToken) dispatch(authCheckThunk())
      else dispatch(authChecked())
    }
  }, [])

  return (
    <div className='h-screen bg-default text-white'>
      <Header />
      {!authCheck ? (
        <div className='h-full flex items-center'>
          <div className='w-screen flex justify-center items-center'>
            <Icon className='animate-spin mr-3' size={[64, 64]} fill='#ffffff' name='SpinnerIcon' />
          </div>
        </div>
      ) : userInfo ? (
        <Routes>
          <Route path='/*' element={<Main />} />
        </Routes>
      ) : (
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Registry />} />
          <Route path='/*' element={<Navigate to='/login' replace={true} />} />
        </Routes>
      )}
    </div>
  )
}

export default App
