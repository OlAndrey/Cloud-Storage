import AccountDetails from './AccountDetails'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'
import Usage from './Usage'
import UserHeader from './UserHeader'

const AccountTab = ({className}: {className: string}) => {
  return (
    <div className={className}>
      <UserHeader />
      <div className='mt-8 flex flex-row flex-wrap gap-y-8 gap-x-10'>
        <div className='flex flex-1 flex-col space-y-8'>
          <Usage />
          <ChangePassword />
        </div>
        <div className='flex flex-1 flex-col space-y-8'>
          <AccountDetails />
          <DeleteAccount />
        </div>
      </div>
    </div>
  )
}

export default AccountTab
