export interface IPlan {
  _id: string
  name: string
  type: 'one_time' | 'subscription'
  price: number
  priceId: string
}
