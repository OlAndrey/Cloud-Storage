const express = require('express')
const {
  register,
  login,
  getMe,
  editUserName,
  resetPassword,
  recoveryPassword,
  editPassword,
  deleteAccount,
  uploadAvatar
} = require('../containers/authContainer')
const checkAuth = require('../utils/checkAuth')

const route = express.Router()

route.post('/registration', register)
route.post('/login', login)
route.post('/avatar', checkAuth, uploadAvatar)
route.put('', checkAuth, editUserName)
route.put('/password', checkAuth, editPassword)
route.post('/recovery/:userId', recoveryPassword)
route.post('/reset-password', resetPassword)
route.get('/me', checkAuth, getMe)
route.delete('', checkAuth, deleteAccount)

module.exports = route
