const express = require('express')
const { register, login, getMe } = require('../containers/authContainer')
const checkAuth = require('../utils/checkAuth')

const route = express.Router()

route.post('/registration', register)
route.post('/login', login)
route.get('/me', checkAuth, getMe)

module.exports = route
