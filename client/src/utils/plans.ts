import axios from './axios'
import { IPlan } from '../types/plan'

export const getPlans = async (): Promise<{ plans: IPlan[] } | string> => {
  try {
    const res = await axios.get('/api/plan')

    return res.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response && error.response.data.message) return error.response.data.message
    else return error.message
  }
}
