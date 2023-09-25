import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks/redux'
import { authCheckThunk, authChecked } from './store/reducers/authSlice'
import Login from './components/authorization/Login'
import Registry from './components/authorization/Registry'
import Main from './components/drive/Main'
import Header from './components/header/Header'
import Icon from './components/icon/Icon'
import Trash from './components/drive/Trash'
import Recent from './components/recent/Recent'
import SearchResultPage from './components/search/SearchResultPage'
import Preferences from './components/preferences/Preferences'
import SideBar from './components/menu/SideBar'
import Success from './components/success/Success'
import Cancel from './components/cancel/Cancel'

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
    <div className='min-h-screen bg-default text-white'>
      <Header />
      {userInfo ? <SideBar /> : ''}
      {!authCheck ? (
        <div className='h-full flex items-center'>
          <div className='w-screen flex justify-center items-center'>
            <Icon className='animate-spin mr-3' size={[64, 64]} fill='#ffffff' name='SpinnerIcon' />
          </div>
        </div>
      ) : userInfo ? (
        <Routes>
          <Route path='/drive/folders/:id' element={<Main />} />
          <Route path='/drive' element={<Main />} />
          <Route path='/shared' element={<Recent />} />
          <Route path='/recent' element={<Recent />} />
          <Route path='/trash' element={<Trash />} />
          <Route path='/search/:q/:dir' element={<SearchResultPage />} />
          <Route path='/search/:q' element={<SearchResultPage />} />
          <Route path='/preferences' element={<Preferences />} />
          <Route path='/cancel' element={<Cancel />} />
          <Route path='/success' element={<Success />} />
          <Route path='/*' element={<Navigate to='/drive' replace={true} />} />
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
