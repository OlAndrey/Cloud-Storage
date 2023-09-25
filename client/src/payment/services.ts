/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserInfo } from '../types/auth'
import axios from '../utils/axios'

export const handleCheckout = (planId: string) => {
  axios
    .post('/api/v1/create-subscription-checkout-session', { planId: planId })
    .then((res) => res.data)
    .then(({ session }) => {
      window.location = session.url
    })
    .catch((e) => {
      console.log(e.error)
    })
}

export const handlePaymentSuccess = async (): Promise<IUserInfo | string> => {
  try {
    const res = await axios.get('/api/v1/payment-success')

    return res.data.user
  } catch (error: any) {
    console.error(error)
    if (error.response && error.response.data.message) return error.response.data.message
    return error.message
  }
}
