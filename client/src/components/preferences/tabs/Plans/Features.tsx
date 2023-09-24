import Icon from '../../../icon/Icon'

const Features = () => {
  const featureList: string[] = [
    'Zero-knowledge cloud storage',
    'All subscriptions come with a 30-day money-back guarantee',
    'Cancel at any time',
    'Premium support',
  ]

  return (
    <div>
      <h1 className='my-7 text-2xl font-medium text-gray-100 lg:text-center'>
        Features included in all plans
      </h1>
      <div className='-mt-2 justify-between space-y-6 lg:flex lg:space-y-0 lg:space-x-6'>
        <div className='mt-3 space-y-2 pl-2'>
          {featureList.map((point) => (
            <div key={point} className='flex flex-row items-center'>
              <Icon name='Check' size={[18, 18]} />
              <p className='ml-2 flex-1 text-gray-80'>{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features
