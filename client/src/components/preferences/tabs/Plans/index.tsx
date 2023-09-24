import { useEffect, useState } from 'react'
import PlanSelector from './PlanSelector'
import Features from './Features'

interface IPlan {
  _id: string
  name: string
  type: 'one_time' | 'subscription'
  price: number
  priceId: string
}

const PlansTab = ({ className }: { className: string }) => {
  const intervalSwitch = [
    { title: 'month', text: 'Monthly' },
    { title: 'lifetime', text: 'Lifetime' },
    { title: 'year', text: 'Annually' },
  ]
  const [prices, setPrices] = useState<IPlan[]>([
  ])
  const [interval, setInterval] = useState('lifetime')

  useEffect(() => {
    setPrices([
      {
        _id: '1',
        name: '50Gb',
        type: 'one_time',
        price: 9.99,
        priceId: '',
      },
      {
        _id: '2',
        name: '100Gb',
        type: 'one_time',
        price: 18.99,
        priceId: '',
      },{
        _id: '3',
        name: '150Gb',
        type: 'one_time',
        price: 27.99,
        priceId: ''
      }])
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
