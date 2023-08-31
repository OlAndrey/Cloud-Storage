const express = require('express')
const checkAuth = require('../utils/checkAuth')
const { getRecentFiles, getSharedFiles } = require('../containers/recentContainer')

const route = express.Router()

route.get('', checkAuth, getRecentFiles)
route.get('/shared', checkAuth, getSharedFiles)

module.exports = route
