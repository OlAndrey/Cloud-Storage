import { useEffect, useState } from 'react'
import PlanSelector from './PlanSelector'
import Features from './Features'
import { getPlans } from '../../../../utils/plans'
import { IPlan } from '../../../../types/plan'

const PlansTab = ({ className }: { className: string }) => {
  const intervalSwitch = [
    { title: 'month', text: 'Monthly' },
    { title: 'lifetime', text: 'Lifetime' },
    { title: 'year', text: 'Annually' },
  ]
  const [prices, setPrices] = useState<IPlan[]>([])
  const [interval, setInterval] = useState('lifetime')

  const getData = async () => {
    const data = await getPlans()
    console.log(data)
    if (typeof data !== 'string') setPrices(data.plans)
    else console.error(data)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className={className}>
      <div className='flex justify-center'>
        <div className='bg-zinc-700 flex flex-row rounded-lg bg-cool-gray-10 p-0.5 mb-4 text-sm'>
          {intervalSwitch.map((item) => (
            <button
              key={item.title}
              className={`${
                item.title === interval ? 'bg-zinc-900 text-gray-100 shadow-sm' : 'text-gray-50'
              } rounded-lg py-1.5 px-6 font-medium`}
              onClick={() => setInterval(item.title)}
              disabled={item.title !== interval}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
      <PlanSelector prices={prices} />
      <Features />
    </div>
  )
}

export default PlansTab
