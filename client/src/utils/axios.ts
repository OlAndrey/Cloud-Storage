import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  config.headers.authorization = window.localStorage.getItem('userToken')

  return config
})

export default instance
