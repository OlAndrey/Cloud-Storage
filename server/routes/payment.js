const express = require('express')
const checkAuth = require('../utils/checkAuth')
const { checkPaid, getStripeSession } = require('../containers/stripeContainer')

const route = express.Router()

route.post('/create-subscription-checkout-session', checkAuth, getStripeSession)
route.get('/payment-success', checkAuth, checkPaid)

module.exports = route
