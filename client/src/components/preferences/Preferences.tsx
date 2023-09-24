import { FC, useEffect, useRef, useState } from 'react'
import AccountTab from './tabs/Account'
import Container from '../container'
import PlansTab from './tabs/Plans'
import { useNavigate } from 'react-router-dom'

const PREFERENCES_TABS = ['account', 'billing', 'plans'] as const
type PreferencesTabID = (typeof PREFERENCES_TABS)[number]

const Preferences = () => {
  const TABS: {
    id: PreferencesTabID
    label: string
    component: FC<{ className: string }>
  }[] = [
    { id: 'account', label: 'Account', component: AccountTab },
    { id: 'plans', label: 'Plans', component: PlansTab },
  ]

  const [activeTab, setActiveTab] = useState<PreferencesTabID>('account')
  const navigate = useNavigate()
  const firstRun = useRef(true)

  function updateUrlWithState() {
    navigate({ search: new URLSearchParams({ tab: activeTab }).toString() }, { replace: true })
  }

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    updateUrlWithState()
  }, [activeTab])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')

    if (tab && PREFERENCES_TABS.includes(tab as PreferencesTabID)) {
      setActiveTab(tab as PreferencesTabID)
    } else if (!tab) {
      updateUrlWithState()
    }
  }, [])

  return (
    <Container error='' loading={false}>
      <div className='flex h-full w-full flex-col'>
        <TabSelector tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        <div className='flex flex-grow flex-row justify-center w-full overflow-y-auto p-2 md:p-8'>
          <div className='w-full overflow-x-visible'>
            {TABS.map(
              ({ component: Component, id }) =>
                Component && (
                  <Component className={`${activeTab !== id ? 'hidden' : ''}`} key={id} />
                ),
            )}
            <div className='h-8' />
          </div>
        </div>
      </div>
    </Container>
  )
}

type TabSelectorPropsTypes = {
  tabs: { id: PreferencesTabID; label: string }[]
  activeTab: PreferencesTabID
  onChange: (newActiveTab: PreferencesTabID) => void
}

function TabSelector({ activeTab, onChange, tabs }: TabSelectorPropsTypes) {
  return (
    <div className='px-8 pt-5'>
      <div className='flex space-x-5 border-b border-gray-100 px-2'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex h-10 items-center border-b-2 px-2 font-medium ${
              tab.id === activeTab
                ? 'border-blue-500 text-blue-500'
                : 'cursor-pointer border-transparent text-gray-600 hover:text-gray-700'
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Preferences
