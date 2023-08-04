import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  config.headers.authorization = window.localStorage.getItem('userToken')

  return config
})

export default instance
