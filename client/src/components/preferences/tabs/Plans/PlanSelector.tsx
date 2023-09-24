interface IPlan {
  _id: string
  name: string
  type: 'one_time' | 'subscription'
  price: number
  priceId: string
}

const PlanSelector = ({ prices }: { prices: IPlan[] }) => {
  return (
    <div className='w-full sm:mx-auto sm:max-w-2xl flex gap-3'>
      {prices.length > 0 ? (
        prices.map((item) => (
          <div key={item._id} className='rounded-lg border border-gray-10 p-5'>
            <div className='text-2xl text-blue-700 py-2 font-bold'>{item.name}</div>
            <div className='font-bold pt-2'>&#36;{item.price}</div>
            <div className='text-gray-400 font-bold py-2'>{item.type.split('_').join(' ')} payment</div>
            <button
              onClick={() => {}}
              className='w-full mt-3 p-2 rounded-lg bg-blue-700 transition duration-150 ease-in-out hover:bg-blue-800'
            >
              Upgrade now
            </button>
          </div>
        ))
      ) : (
        <div className='w-full py-3 text-center text-2xl font-medium'>There are no suitable plans for you at the moment.</div>
      )}
    </div>
  )
}

export default PlanSelector
