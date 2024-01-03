import { ReactNode } from 'react'

const AuthContainer = ({ children, title }: { children: ReactNode; title: string }) => {
  return (
    <div className='h-screen container mx-auto px-4'>
      <div className='flex min-h-full flex-col justify-center items-center'>
        <div className='w-full sm:mx-auto sm:max-w-lg bg-zinc-900 rounded-2xl p-6 sm:px-11 sm:py-14'>
          <h2 className='text-center text-2xl font-bold leading-9 tracking-tight'>{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthContainer
