import AccountDetails from './AccountDetails'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'

const AccountTab = () => {
  return (
    <div>
      <div className='mt-8 flex flex-row flex-wrap gap-y-8 gap-x-10'>
        <div className='flex flex-1 flex-col space-y-8'>
          <AccountDetails />
          <ChangePassword />
        </div>
        <div className='flex flex-1 flex-col space-y-8'>
          <DeleteAccount />
        </div>
      </div>
    </div>
  )
}

export default AccountTab
