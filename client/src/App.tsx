import Login from './components/Login'
// import Registry from './components/Registry'

const App = () => {
  return (
    <div className='h-screen bg-default text-white'>
      <div className='h-full container mx-auto px-4'>
        <div className='flex min-h-full flex-col justify-center items-center'>
          <Login />
        </div>
      </div>
    </div>
  )
}

export default App
