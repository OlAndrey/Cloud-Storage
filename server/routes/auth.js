const express = require('express')
const { register, login } = require('../containers/authContainer')

const route = express.Router()

route.post('/registration', register)
route.post('/login', login)

module.exports = route
