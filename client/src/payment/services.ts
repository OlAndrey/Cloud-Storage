/* eslint-disable @typescript-eslint/no-explicit-any */
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
