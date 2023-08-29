const express = require('express')
const checkAuth = require('../utils/checkAuth')
const { getRecentFiles } = require('../containers/recentContainer')

const route = express.Router()

route.get('', checkAuth, getRecentFiles)

module.exports = route
