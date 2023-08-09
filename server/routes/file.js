const express = require('express')
const checkAuth = require('../utils/checkAuth')
const { createDir, getFiles } = require('../containers/fileContainer')

const route = express.Router()

route.post('', checkAuth, createDir)
route.get('', checkAuth, getFiles)

module.exports = route
