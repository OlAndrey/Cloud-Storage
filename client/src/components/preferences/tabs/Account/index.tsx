import AccountDetails from './AccountDetails'
import ChangePassword from './ChangePassword'

const AccountTab = () => {
  return (
    <div>
      <div className='mt-8 flex flex-row flex-wrap gap-y-8 gap-x-10'>
        <div className='flex flex-1 flex-col space-y-8'>
          <AccountDetails />
        </div>
        <div className='flex flex-1 flex-col space-y-8'>
          <ChangePassword />
        </div>
      </div>
    </div>
  )
}

export default AccountTab
